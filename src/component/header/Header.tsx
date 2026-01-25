'use client';

import Image from 'next/image';
import Link from 'next/link';

import BurgerMenu from './component/BurgerMenu';
import Menu from './component/Menu';
import { useAuth } from '@/app/context/AuthContext';

export default function Header() {
  const { user } = useAuth();
  return (
    <div className="bg-(--background-header) flex justify-between h-24 ">
      <Link href="/" className="flex">
        <Image
          className="p-3 h-16 w-16 sm:h-25 sm:w-25 self-center-safe"
          src="/icone-manette.png"
          width={100}
          height={100}
          alt="gamerchallenge logo"
        />
        <h1 className=" text-sm sm:text-3xl font-extrabold content-center">GamerChallenge</h1>
      </Link>

      {/* desktop menu */}

      <Menu />
      <div className="flex">
        {user ? (
          <p className="content-center mr-5 text-sm sm:text-lg">Welcome {user.username}</p>
        ) : (
          <div></div>
        )}
        <BurgerMenu />
      </div>
    </div>
  );
}
