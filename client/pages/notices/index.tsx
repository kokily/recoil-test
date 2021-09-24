import { useRecoilValueLoadable } from 'recoil';
import { useRouter } from 'next/router';
import axios from 'axios';
import { listNotices } from '../../store/notices';
import React, { useCallback, useState } from 'react';

function ListNoticesPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const notices = useRecoilValueLoadable(listNotices({ title, tag }));

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const onSearch = (e: React.MouseEvent) => {
    e.preventDefault();

    if (search === '') {
      return;
    } else {
      setTitle(search);
    }
  };

  const onTag = (tag: string) => {
    setTag(tag);
  };

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
            <input type="text" name="title" value={search} onChange={onChange} />
            <button onClick={onSearch}>검색</button>
          </div>
          <div>
            {notices.contents.map((notice) => (
              <div key={notice.id}>
                <h3 onClick={() => router.push(`/notices/${notice.id}`)}>
                  {notice.title}
                </h3>
                <ul>
                  {notice.tags.map((tag) => (
                    <li key={tag} onClick={() => onTag(tag)}>
                      #{tag}
                    </li>
                  ))}
                </ul>
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

  const res = await axios.get<NoticeType[]>('/api/notices');

  const initialRecoilState = {
    notices: res.data,
  };

  return {
    props: { initialRecoilState },
  };
};

export default ListNoticesPage;
