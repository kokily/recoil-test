import axios from 'axios';
import { atom, selector } from 'recoil';

axios.defaults.baseURL = 'http://localhost:4000/api';
axios.defaults.withCredentials = true;

type NoticeType = {
  id: string;
  title: string;
  body: string;
  thumbnail?: string;
  tags: string[];
  created_at: string;
};

export const notices = atom<{
  notices: NoticeType[];
  notice: NoticeType | null;
}>({
  key: 'notices',
  default: {
    notices: [],
    notice: null,
  },
});

export const listNotices = selector<NoticeType[]>({
  key: 'listNotices',
  get: async () => {
    const res = await axios.get('/notices');

    return res.data;
  },
});
