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
    <div className="bg-(--background-header) flex justify-between h-24">
      <Image src="/icone-manette.png" width={100} height={100} alt="gamerchallenge logo" />
      <nav className="text-right pr-2 pt-2">
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
          <ul className="bg-(--button-area) rounded-xl text-center z-10 p-2 ">
            <li className={`m-1 ${pathActive('/') ? 'bg-(--button-select)' : ''} rounded-xl`}>
              <Link href="/">Home</Link>
            </li>
            <li className={`m-1 ${pathActive('/games') ? 'bg-(--button-select)' : ''} rounded-xl`}>
              <Link href="/games">Games</Link>
            </li>
            <li
              className={`m-1 ${pathActive('/challenges') ? 'bg-(--button-select)' : ''} rounded-xl`}
            >
              <Link href="/challenges">Challenges</Link>
            </li>
            <li
              className={`m-1 ${pathActive('/leaderboard') ? 'bg-(--button-select)' : ''} rounded-xl`}
            >
              <Link href="/leaderboard">Leaderboard</Link>
            </li>
            <li
              className={`m-1 ${pathActive('/profile') ? 'bg-(--button-select)' : ''} rounded-xl`}
            >
              <Link href="/profile">Profile</Link>
            </li>
            {/* TODO change from profile to log/register when not loggin*/}
            <li
              className={`m-1 ${pathActive('/challenges/create') ? 'bg-(--button-select)' : ''} rounded-xl`}
            >
              <Link href="/challenges/create">Create challenge</Link>
            </li>
            {/* TODO does not appear when not loggin*/}
            <li
              className={`m-1 ${pathActive('/support') ? 'bg-(--button-select)' : ''} rounded-xl`}
            >
              <Link href="/support">Support</Link>
            </li>
            <li
              className={`m-1 ${pathActive('/disconnect') ? 'bg-(--button-select)' : ''} rounded-xl`}
            >
              <Link href="/disconnect">Disconnect</Link>
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
}
