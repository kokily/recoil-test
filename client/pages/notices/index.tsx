import { useRecoilValueLoadable } from 'recoil';
import { useRouter } from 'next/router';
import axios from 'axios';
import Markdown from '../../components/common/Markdown';
import { listNotices } from '../../store/notices';

function ListNoticesPage() {
  const router = useRouter();
  const notices = useRecoilValueLoadable(listNotices);

  switch (notices.state) {
    case 'loading':
      return (
        <div>
          <h2>Loading...</h2>
        </div>
      );
    case 'hasValue':
      return (
        <div>
          <button onClick={() => router.back()}>뒤로</button>
          <div>
            {notices.contents.map((notice) => (
              <div key={notice.id}>
                <h3>{notice.title}</h3>
                <Markdown markdown={notice.body} />
              </div>
            ))}
          </div>
        </div>
      );
    case 'hasError':
      return <div>Error</div>;
  }
}

export const getServerSideProps = async () => {
  axios.defaults.baseURL = 'http://localhost:4000';
  axios.defaults.withCredentials = true;

  const res = await axios.get('/api/notices');

  const initialRecoilState = {
    notices: res.data,
  };

  return {
    props: { initialRecoilState },
  };
};

export default ListNoticesPage;
