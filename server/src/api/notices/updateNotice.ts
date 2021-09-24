import Joi from 'joi';
import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Notice } from '../../entities/Notice';
import { cleanAllNullArgs, validateBody } from '../../libs/utils';

export default async function updateNotice(ctx: Context) {
  const { id }: { id?: string } = ctx.query;

  type RequestBody = {
    title?: string;
    body?: string;
    thumbnail?: string;
    tags?: string[];
  };

  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    thumbnail: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  if (!validateBody(ctx, schema)) return;

  try {
    if (id) {
      const notNull = cleanAllNullArgs(ctx.request.body);

      await getRepository(Notice).update({ id }, { ...notNull, updated_at: new Date() });

      ctx.status = 200;
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
