import React from 'react';
import axios from 'axios';
import useListNotices from '../../libs/hooks/useListNotices';

function ListNoticesPage() {
  const { data, loading, error, search, onChange, onSearch, onTag, onBack, onDetail } =
    useListNotices();

  if (loading)
    return (
      <div>
        <h3>Loading...</h3>
      </div>
    );

  if (error) return <div>Error</div>;

  return (
    <div>
      <button onClick={onBack}>처음으로</button>
      <div>
        <input type="text" name="title" value={search} onChange={onChange} />
        <button onClick={onSearch}>검색</button>
      </div>
      <div>
        {data.map((notice) => (
          <div key={notice.id + new Date()}>
            <h3 onClick={() => onDetail(notice.id)}>{notice.title}</h3>
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
