import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Question } from '../../entities/Question';

export default async function confirmQuestion(ctx: Context) {
  const { id }: { id?: string } = ctx.query;

  try {
    if (id) {
      await getRepository(Question).update({ id }, { isConfirm: true });

      ctx.status = 200;
    } else {
      ctx.status = 404;
      ctx.body = {
        name: 'No ID',
      };

      return;
    }
  } catch (err) {
    if (err instanceof Error) {
      ctx.throw(500, err);
    }
  }
}
