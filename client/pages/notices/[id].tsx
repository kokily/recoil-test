import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useRecoilValueLoadable } from 'recoil';
import axios from 'axios';
import { readNotice } from '../../store/notices';
import Markdown from '../../components/common/Markdown';

function ReadNoticePage() {
  const router = useRouter();
  const { id }: { id?: string } = router.query;
  const notice = useRecoilValueLoadable(readNotice(id));

  switch (notice.state) {
    case 'loading':
      return (
        <div>
          <h3>Loading...</h3>
        </div>
      );
    case 'hasValue':
      const data = notice.contents;

      return (
        <div>
          <div>
            <button onClick={() => router.back()}>뒤로</button>
          </div>
          <div>
            <h2>{data.title}</h2>
            <Markdown markdown={data.body} />
            <div>
              {data.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      );
    case 'hasError':
      return <div>Error</div>;
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id }: { id?: string } = context.params;
  axios.defaults.baseURL = 'http://localhost:4000/api';
  axios.defaults.withCredentials = true;

  const res = await axios.get<NoticeType>(`/notices/${id}`);

  const initialRecoilState = {
    notice: res.data,
  };

  return {
    props: { initialRecoilState },
  };
};

export default ReadNoticePage;
