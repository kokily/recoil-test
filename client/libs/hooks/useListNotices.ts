import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import _concat from 'lodash/concat';
import { listNotices, notices } from '../../store/notices';

export default function useListNotices() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [lastId, setLastId] = useState('');

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [data, setData] = useRecoilState<NoticeType[]>(notices);
  const [moreNotices, setMoreNotices] = useState<boolean>(true);
  const dataResponse = useRecoilValueLoadable(listNotices({ title, tag, lastId }));

  const fetchData = useCallback((): void => {
    if (dataResponse === null || dataResponse === undefined) {
      return;
    }

    console.log(dataResponse.state);

    switch (dataResponse.state) {
      case 'loading':
        setLoading(true);
        break;
      case 'hasError':
        setLoading(false);
        setError(true);
        break;
      case 'hasValue':
        setLoading(false);
        setData(_concat(data, dataResponse.contents.data));
        break;
    }
  }, [setData, dataResponse.state]);

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

  const onDetail = (id: string) => {
    router.push(`/notices/${id}`);
  };

  const onBack = () => {
    router.back();
  };

  useEffect(() => {
    if (data.length === 0) {
      fetchData();
    }

    function onScroll() {
      if (dataResponse.contents.hasMoreNotices) {
        if (
          window.scrollY + document.documentElement.clientHeight >
          document.documentElement.scrollHeight - 300
        ) {
          setMoreNotices(true);
          setLastId(data[data.length - 1]?.id);
          fetchData();
        }
      } else {
        setMoreNotices(false);
      }
    }

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    search,
    onChange,
    onSearch,
    onTag,
    onBack,
    onDetail,
  };
}
