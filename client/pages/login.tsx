import React, { useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000/api';
axios.defaults.withCredentials = true;

function login() {
  const [password, setPassword] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onLogin = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/auth/login', {
        password,
      });

      if (!response.data) {
        alert('없다!');
        return;
      }

      document.location.href = '/';
    } catch (err) {
      if (err instanceof Error) {
        alert(err);
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <div>
        <div>비밀번호</div>
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          required
        />
        <button onClick={onLogin}>로그인</button>
      </div>
    </div>
  );
}

export default login;
