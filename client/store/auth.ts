import { atom, selector } from 'recoil';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000/api';
axios.defaults.withCredentials = true;

export const meState = atom<AdminType>({
  key: 'me',
  default: {
    admin_id: null,
  },
});

// Check Me
export const getMe = selector({
  key: 'meSelector',
  get: async () => {
    const res = await axios.get('/auth/me');

    return res.data;
  },
});
