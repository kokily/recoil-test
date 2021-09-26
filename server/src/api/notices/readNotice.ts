import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Notice } from '../../entities/Notice';

export default async function readNotice(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  try {
    const notice = await getRepository(Notice).findOne(id);

    console.log(id);

    if (!notice) {
      ctx.status = 404;
      ctx.body = {
        name: 'Not found content',
      };

      return;
    }

    ctx.body = notice;
  } catch (err) {
    if (err instanceof Error) {
      ctx.throw(500, err);
    }
  }
}
