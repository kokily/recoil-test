import axios from 'axios';
import Link from 'next/link';
import useAdmin from '../libs/hooks/useAdmin';

axios.defaults.baseURL = 'http://localhost:4000/api';
axios.defaults.withCredentials = true;

function IndexPage() {
  const { admin, onLogout } = useAdmin();

  switch (admin.state) {
    case 'hasValue':
      return (
        <div>
          <div>
            <Link href="/notices">
              <a>공지사항</a>
            </Link>
          </div>
          <div>
            <Link href="/notices/add">
              <a>공지 작성</a>
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
