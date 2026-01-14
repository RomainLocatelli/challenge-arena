'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const [isClose, setIsClose] = useState(false);
  function openCloseMenu() {
    setIsClose(!isClose);
  }
  const pathname = usePathname();
  const pathActive = (path: string) => pathname === path;
  return (
    <div className="bg-(--background-header) text-white flex justify-between h-24 ">
      <Link href="/" className="flex">
        <Image
          className="ml-5"
          src="/icone-manette.png"
          width={100}
          height={100}
          alt="gamerchallenge logo"
        />
        <h1 className="ml-4 text-3xl font-extrabold content-center">GamerChallenge</h1>
      </Link>

      {/* desktop menu */}

      <nav className="collapse lg:visible lg:content-center">
        <ul className="lg:flex lg:bg-(--button-area) lg:rounded-full">
          <li
            className={`m-2 p-2 pr-4 pl-4 ${pathActive('/') ? 'bg-(--button-select)' : ''} rounded-3xl`}
          >
            <Link href="/">Home</Link>
          </li>
          <li
            className={`m-2 p-2  pr-4 pl-4 ${pathActive('/games') ? 'bg-(--button-select)' : ''} rounded-3xl`}
          >
            <Link href="/games">Games</Link>
          </li>
          <li
            className={`m-2 p-2  pr-4 pl-4 ${pathActive('/challenges') ? 'bg-(--button-select)' : ''} rounded-3xl`}
          >
            <Link href="/challenges">Challenges</Link>
          </li>
          <li
            className={`m-2 p-2  pr-4 pl-4 ${pathActive('/leaderboard') ? 'bg-(--button-select)' : ''} rounded-3xl`}
          >
            <Link href="/leaderboard">Leaderboard</Link>
          </li>
        </ul>
      </nav>

      {/* Burger menu */}

      <nav className="text-right pr-2 pt-2 relative">
        <button type="button" className="bg-(--button-area) p-4 rounded-xl" onClick={openCloseMenu}>
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {isClose && (
          <ul className="bg-(--button-area) rounded-xl text-center z-10 p-3 absolute right-1">
            <li
              className={`m-1.5 pl-1.5 pr-1.5 ${pathActive('/') ? 'bg-(--button-select) bg-origin-padding p-1.5' : ''} rounded-full`}
            >
              <Link href="/">Home</Link>
            </li>
            <li
              className={`m-1.5 pl-1.5 pr-1.5 ${pathActive('/games') ? 'bg-(--button-select) bg-origin-padding p-1.5' : ''} rounded-full`}
            >
              <Link href="/games">Games</Link>
            </li>
            <li
              className={`m-1.5 pl-1.5 pr-1.5 ${pathActive('/challenges') ? 'bg-(--button-select) bg-origin-padding p-1.5' : ''} rounded-full`}
            >
              <Link href="/challenges">Challenges</Link>
            </li>
            <li
              className={`m-1.5 pl-1.5 pr-1.5 ${pathActive('/leaderboard') ? 'bg-(--button-select) bg-origin-padding p-1.5' : ''} rounded-full`}
            >
              <Link href="/leaderboard">Leaderboard</Link>
            </li>
            <li
              className={`m-1.5 pl-1.5 pr-1.5 ${pathActive('/profile') ? 'bg-(--button-select) bg-origin-padding p-1.5' : ''} rounded-full`}
            >
              <Link href="/profile">Profile</Link>
            </li>
            {/* TODO change from profile to log/register when not loggin*/}
            <li
              className={`m-1.5 pl-1.5 pr-1.5 ${pathActive('/challenges/create') ? 'bg-(--button-select) bg-origin-padding p-1.5' : ''} rounded-full`}
            >
              <Link href="/challenges/create">Create challenge</Link>
            </li>
            {/* TODO does not appear when not loggin*/}
            <li
              className={`m-1.5 pl-1.5 pr-1.5 ${pathActive('/support') ? 'bg-(--button-select) bg-origin-padding p-1.5' : ''} rounded-full`}
            >
              <Link href="/support">Support</Link>
            </li>
            <li
              className={`m-1.5 pl-1.5 pr-1.5 ${pathActive('/disconnect') ? 'bg-(--button-select) bg-origin-padding p-1.5' : ''} rounded-full`}
            >
              <Link href="/disconnect">Disconnect</Link>
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
}
