'use client';
import { useState } from 'react';

type Register = {
  nickname: string;
  email: string;
  password: string;
};

export default function authRegister() {
  const [userNickname, setNickname] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const registerUrl = process.env.API_URL || '';

  async function postForm(url: string, values: Register) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(values)
      });
      if (response.status >= 300) {
        setErrorMessage('An error happened, thank you to try later');
      } else {
        setSuccessMessage('Resgistration successful, time to challenge yourself');
      }
    } catch (e) {
      setErrorMessage('An error happened, thank you to try later');
    }
  }

  function handleAction() {
    const formValues = {
      nickname: userNickname,
      email: userEmail,
      password: userPassword
    };
    postForm(registerUrl, formValues);
  }

  return (
    <main className="min-h-screen">
      <h2 className="text-4xl text-center mt-10 font-extrabold">Registration</h2>
      <form action={handleAction}>
        <h2 className="text-xl text-center lg:mt-40 mt-15">{successMessage}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:auto-rows-[80px] auto-rows-fr gap-4 mb-5 mt-5 ml-10 mr-10 lg:mr-60 lg:ml-60">
          <div className="flex flex-col p-3 pl-7 pr-7 bg-(--button-area) rounded-3xl focus-within:bg-(--button-select) lg:mr-10">
            <label htmlFor="nickname">Your nickname</label>
            <input
              type="text"
              value={userNickname}
              placeholder="Your nickname"
              onChange={(e) => setNickname(e.target.value)}
              id="nickname"
              className=""
            />
          </div>
          <div className="flex flex-col p-3 pl-7 pr-7 bg-(--button-area) rounded-3xl focus-within:bg-(--button-select) lg:ml-10">
            <label htmlFor="email">Your email address</label>
            <input
              type="email"
              value={userEmail}
              placeholder="Your email address"
              onChange={(e) => setUserEmail(e.target.value)}
              id="email"
              className=""
            />
          </div>
          <div className="flex flex-col p-3 pl-7 pr-7 bg-(--button-area) rounded-3xl focus-within:bg-(--button-select) lg:mr-10">
            <label htmlFor="password">Your password</label>
            <input
              type="password"
              value={userPassword}
              placeholder="Your password"
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              className=""
            />
          </div>
          <div className="flex flex-col p-3 pl-7 pr-7 bg-(--button-area) rounded-3xl focus-within:bg-(--button-select) lg:ml-10">
            <label htmlFor="passwordConfirmation">Confirm your password</label>
            <input
              type="password"
              value={passwordConfirm}
              placeholder="Confirm password"
              onChange={(e) => setPasswordConfirm(e.target.value)}
              id="passwordConfirmation"
              className=""
            />
          </div>
        </div>
        <div className="flex justify-center flex-col items-center">
          <button
            type="submit"
            className="bg-(--button-area) p-3 pl-7 pr-7 mt-7 mb-10 cursor-pointer rounded-3xl flex justify-center hover:bg-(--button-select) lg:pr-10 lg:pl-10"
          >
            Submit
          </button>
          {errorMessage && <p>{errorMessage}</p>}
        </div>
      </form>
    </main>
  );
}
