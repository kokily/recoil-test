import { Context, Middleware, Next } from 'koa';
import { getRepository } from 'typeorm';
import { Admin } from '../../entities/Admin';
import { AccessTokenType, decodeToken, RefreshTokenType, setCookie } from '../token';

export const tokenRefresh = async (ctx: Context, refreshToken: string) => {
  try {
    const decoded = await decodeToken<RefreshTokenType>(refreshToken);
    const admin = await getRepository(Admin).findOne(decoded.admin_id);
    if (!admin) {
      const error = new Error('InvalidUserError');
      throw error;
    }
    const tokens = await admin.refreshAdminToken(
      decoded.token_id,
      decoded.exp,
      refreshToken
    );
    setCookie(ctx, tokens);
    return decoded.admin_id;
  } catch (err) {
    throw err;
  }
};

const jwtMiddleware: Middleware = async (ctx: Context, next: Next) => {
  let accessToken: string | undefined = ctx.cookies.get('access_token');
  const refreshToken: string | undefined = ctx.cookies.get('refresh_token');

  try {
    if (!accessToken) return next();

    const accessTokenData = await decodeToken<AccessTokenType>(accessToken);

    ctx.state.admin_id = accessTokenData.admin_id;

    const diff = accessTokenData.exp * 1000 - new Date().getTime();

    if (diff < 1000 * 60 * 30 && refreshToken) {
      await tokenRefresh(ctx, refreshToken);
    }

    return next();
  } catch (err) {
    if (!refreshToken) return next();

    try {
      const admin_id = await tokenRefresh(ctx, refreshToken);

      ctx.state.admin_id = admin_id;

      return next();
    } catch (err) {
      console.error(err);
      return next();
    }
  }
};

export default jwtMiddleware;
