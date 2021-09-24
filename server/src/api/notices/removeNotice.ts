import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Notice } from '../../entities/Notice';

export default async function removeNotice(ctx: Context) {
  const { id }: { id?: string } = ctx.query;

  try {
    if (id) {
      await getRepository(Notice).delete(id);

      ctx.status = 204;
    } else {
      ctx.status = 400;
      ctx.body = {
        name: 'Not ID',
      };

      return;
    }
  } catch (err) {
    if (err instanceof Error) {
      ctx.throw(500, err);
    }
  }
}
