import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import qs from 'qs';
import axios from 'axios';
import { notices } from '../../store/notices';
import { toast } from 'react-toastify';

export default function useListNotices() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>(null);
  const [data, setData] = useRecoilState<NoticeType[]>(notices);
  // const dataResponse = useRecoilValueLoadable(listNotices({ title, tag, page }));

  const fetchData = async () => {
    setLoading(true);

    try {
      const queryString = qs.stringify({ title, tag, page });
      const res = await axios.get(`/notices?${queryString}`);

      setData(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err instanceof Error) {
        setError(err);
        toast.error(err);
      }
    }
  };

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
    fetchData();
  }, [page]);

  useEffect(() => {
    const scrollY = window.scrollY;
    const clientHeight = document.documentElement.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    function onScroll() {
      if (scrollY + clientHeight > scrollHeight - 300) {
        setPage(page + 1);
      }
    }

    console.log(page);

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [page]);

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
