import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { getMe } from '../../store/auth';

axios.defaults.baseURL = 'http://localhost:4000/api';
axios.defaults.withCredentials = true;

export default function useAdmin() {
  const admin = useRecoilValueLoadable(getMe);

  const onLogout = async () => {
    try {
      await axios.post('/auth/logout');

      document.location.href = '/';
    } catch (err) {
      if (err instanceof Error) {
        alert(err);
      }
    }
  };

  return {
    admin,
    onLogout,
  };
}
