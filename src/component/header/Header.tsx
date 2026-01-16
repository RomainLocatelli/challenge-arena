'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BurgerMenu from './component/BurgerMenu';

export default function Header() {
  const pathname = usePathname();
  const pathActive = (path: string) => pathname === path;
  return (
    <div className="bg-(--background-header) flex justify-between h-24 ">
      <Link href="/" className="flex">
        <Image
          className="p-3"
          src="/icone-manette.png"
          width={100}
          height={100}
          alt="gamerchallenge logo"
        />
        <h1 className=" text-xl lg:text-3xl font-extrabold content-center">GamerChallenge</h1>
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

      <BurgerMenu />
    </div>
  );
}
