import type { FormEvent } from "react";

import { NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { APP_SERVICE_HOST } from ".";
import { setCookie } from "nookies";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault(); // デフォルトの<form />の挙動を無効にする
    const user = {
      user_name: name,
      password: password
    };
    axios.post(`${APP_SERVICE_HOST}/login`, user)
      .then(res => {
        const options = {
          maxAage: 60 * 60,
          secure: true,
          path: '/',
        }
        setCookie({ res }, 'token', res.data.access_token, options);   
        router.push("/books"); // ダッシュボードページへ遷移させる
      })
      .catch(() => {
        console.log(111)
        return ''
      });
  };

  return (
    <div>
      <h1>ログイン画面</h1>

      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            value={name}
            onInput={(e) => setName(e.currentTarget.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onInput={(e) => setPassword(e.currentTarget.value)}
          />
        </div>

        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginPage;