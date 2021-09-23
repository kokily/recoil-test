import Joi from 'joi';
import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Admin } from '../../entities/Admin';
import { setCookie } from '../../libs/token';
import { validateBody } from '../../libs/utils';

export default async function login(ctx: Context) {
  type RequestType = {
    password: string;
  };

  const schema = Joi.object().keys({
    password: Joi.string().min(4).required(),
  });

  if (!validateBody(ctx, schema)) return;

  const { password }: RequestType = ctx.request.body;

  try {
    const admin = await getManager().createQueryBuilder(Admin, 'admin').getOne();

    if (!admin) {
      ctx.status = 404;
      ctx.body = {
        name: '관리자 등록이 안 되었습니다.',
      };

      return;
    }

    const valid = await admin.validPassword(password);

    if (!valid) {
      ctx.status = 401;
      ctx.body = {
        name: '비밀번호가 틀렸습니다.',
      };

      return;
    }

    const tokens = await admin.generateToken();

    setCookie(ctx, tokens);

    ctx.body = ctx.state.admin_id;
  } catch (err) {
    if (err instanceof Error) {
      ctx.throw(500, err);
    }
  }
}
