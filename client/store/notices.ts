import axios from 'axios';
import qs from 'qs';
import { atom, selectorFamily } from 'recoil';

axios.defaults.baseURL = 'http://localhost:4000/api';
axios.defaults.withCredentials = true;

export const notices = atom<{
  notices: NoticeType[];
  hasMoreNotices: boolean;
  notice: NoticeType | null;
}>({
  key: 'notices',
  default: {
    notices: [],
    hasMoreNotices: true,
    notice: null,
  },
});

type QueryType = {
  title?: string;
  tag?: string;
  lastId?: string;
};

export const listNotices = selectorFamily<NoticeType[], QueryType>({
  key: 'listNotices',
  get:
    ({ title, tag, lastId }) =>
    async () => {
      const queryString = qs.stringify({ title, tag, lastId });
      const res = await axios.get(`/notices?${queryString}`);

      return res.data;
    },
});

// args (Return type, arg)
export const readNotice = selectorFamily<NoticeType, string>({
  key: 'readNotice',
  get: (id) => async () => {
    const res = await axios.get(`/notices/${id}`);

    return res.data;
  },
});
