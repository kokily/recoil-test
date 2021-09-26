import { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import { meState } from '../store/auth';
import { notices } from '../store/notices';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';

const all_atoms = {
  meState: meState,
  notices: notices,
};

const initializeRecoilState =
  (initialRecoilState) =>
  ({ set }) =>
    Object.keys(initialRecoilState).map((key) => {
      const value = initialRecoilState[key];
      const atom = all_atoms[key];

      set(atom, value);
    });

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <RecoilRoot initializeState={initializeRecoilState({})}>
        <Component {...pageProps} />
      </RecoilRoot>
    </>
  );
}

export default App;
