import { Context } from 'koa';
import { getManager, getRepository } from 'typeorm';
import { Notice } from '../../entities/Notice';

export default async function listNotices(ctx: Context) {
  const { lastId, title, tag }: { lastId?: string; title?: string; tag?: string } =
    ctx.query;

  try {
    const query = await getManager()
      .createQueryBuilder(Notice, 'notices')
      .limit(20)
      .orderBy('notices.created_at', 'DESC')
      .addOrderBy('notices.id', 'DESC');

    if (title) {
      query.andWhere('notices.title like :title', {
        title: `%${title}%`,
      });
    }

    if (tag) {
      query.andWhere(":tag = ANY (string_to_array(notices.tags, ','))", {
        tag,
      });
    }

    if (lastId) {
      const notice = await getRepository(Notice).findOne({ id: lastId });

      if (!notice) {
        ctx.status = 404;
        ctx.body = {
          name: 'NO_CONTENT',
        };

        return;
      }

      query.andWhere('notices.created_at < :date', {
        date: notice.created_at,
      });

      query.orWhere('notices.created_at = :date AND notices.id < :id', {
        date: notice.created_at,
        id: notice.id,
      });
    }

    const notices = await query.getMany();

    ctx.body = notices;
  } catch (err) {
    if (err instanceof Error) {
      ctx.throw(500, err);
    }
  }
}
