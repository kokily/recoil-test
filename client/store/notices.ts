import axios from 'axios';
import qs from 'qs';
import { atom, selectorFamily } from 'recoil';
import _concat from 'lodash/concat';

axios.defaults.baseURL = 'http://localhost:4000/api';
axios.defaults.withCredentials = true;

export const notices = atom<NoticeType[]>({
  key: 'notices',
  default: [],
});

type QueryType = {
  title?: string;
  tag?: string;
  lastId?: string;
};

type ReturnType = {
  data: NoticeType[];
  hasMoreNotices: boolean;
};

export const listNotices = selectorFamily<ReturnType, QueryType>({
  key: 'listNotices',
  get:
    ({ title, tag, lastId }) =>
    async () => {
      const queryString = qs.stringify({ title, tag, lastId });
      const res = await axios.get(`/notices?${queryString}`);
      const hasMoreNotices = res.data.length === 20;

      return {
        data: res.data,
        hasMoreNotices,
      };
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
