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
  page?: number;
};

type ReturnType = {
  data: NoticeType[];
  hasMoreNotices: boolean;
};

// args (Return type, arg)
export const readNotice = selectorFamily<NoticeType, string>({
  key: 'readNotice',
  get: (id) => async () => {
    const res = await axios.get(`/notices/${id}`);

    return res.data;
  },
});
