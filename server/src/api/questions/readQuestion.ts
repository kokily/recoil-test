import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Question } from '../../entities/Question';

export default async function readQuestion(ctx: Context) {
  const { id }: { id?: string } = ctx.query;

  try {
    const question = await getRepository(Question).findOne(id);

    if (!question) {
      ctx.status = 404;
      ctx.body = {
        name: 'Not Content',
      };

      return;
    }

    ctx.body = question;
  } catch (err) {
    if (err instanceof Error) {
      ctx.throw(500, err);
    }
  }
}
