'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Menu() {
  const pathname = usePathname();
  const pathActive = (path: string) => pathname === path;
  return (
    <nav className="hidden lg:block lg:content-center">
      <ul className="lg:flex lg:bg-(--header-button-area) lg:rounded-full">
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
  );
}
