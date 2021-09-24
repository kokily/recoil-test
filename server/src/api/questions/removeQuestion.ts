import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Question } from '../../entities/Question';

export default async function removeQuestion(ctx: Context) {
  const { id }: { id?: string } = ctx.query;

  try {
    if (id) {
      await getRepository(Question).delete(id);

      ctx.status = 204;
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
