import { useRouter } from 'next/router';
import AddNotice from '../../components/notices/AddNotice';
import useAddNotice from '../../libs/hooks/useAddNotice';
import useAdmin from '../../libs/hooks/useAdmin';

function AddNoticePage() {
  const router = useRouter();
  const { admin } = useAdmin();
  const {
    title,
    body,
    thumbnail,
    tags,
    onChangeTitle,
    onChangeBody,
    onChangeTags,
    onThumbnail,
    onBack,
    onAddNotice,
  } = useAddNotice({ edit: false });

  switch (admin.state) {
    case 'loading':
      return (
        <div>
          <h3>Loading...</h3>
        </div>
      );
    case 'hasError':
      router.back();
      break;
    case 'hasValue':
      return (
        <AddNotice
          edit={false}
          title={title}
          body={body}
          thumbnail={thumbnail}
          tags={tags}
          onChangeTitle={onChangeTitle}
          onChangeBody={onChangeBody}
          onChangeTags={onChangeTags}
          onBack={onBack}
          onThumbnail={onThumbnail}
          onAddNotice={onAddNotice}
        />
      );
  }
}

export default AddNoticePage;
