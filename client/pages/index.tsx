import { useRecoilValueLoadable } from 'recoil';
import Link from 'next/link';
import { getMe } from '../store/auth';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000/api';
axios.defaults.withCredentials = true;

function IndexPage() {
  const me = useRecoilValueLoadable(getMe);

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

  switch (me.state) {
    case 'hasValue':
      return (
        <div>
          <div>
            <Link href="/notices">
              <a>공지사항</a>
            </Link>
          </div>
          <div>
            <button onClick={onLogout}>로그아웃</button>
          </div>
        </div>
      );
    case 'loading':
      return (
        <div>
          <h2>Loading...</h2>
        </div>
      );
    case 'hasError':
      return (
        <div>
          <h2>Test</h2>
          <Link href="/login">
            <a>로그인</a>
          </Link>
        </div>
      );
  }
}

export default IndexPage;
