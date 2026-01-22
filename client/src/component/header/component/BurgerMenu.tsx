'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { LogoutButton } from './Logout';
import ThemeToggle from './light-dark-button';

export default function BurgerMenu() {
  const [isClose, setIsClose] = useState(false);
  const menuRef = useRef<HTMLElement>(null);  // Référence pour le menu
  
  function openCloseMenu() {
    setIsClose(!isClose);
  }

  const pathname = usePathname();
  const pathActive = (path: string) => pathname === path;
  const { user } = useAuth();

  // Détecte les clics en dehors du menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Si le menu est ouvert ET que le clic est en dehors
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsClose(false);
      }
    }

    // Ajoute l'écouteur seulement si le menu est ouvert
    if (isClose) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Nettoie l'écouteur quand le composant se démonte ou que le menu se ferme
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isClose]);

  return (
    <nav ref={menuRef} className="text-right pr-3 pt-4 relative z-50">
      <button
        type="button"
        className="bg-(--header-button-area) p-2 rounded-xl cursor-pointer"
        onClick={openCloseMenu}
      >
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
        <ul className="bg-(--button-area) rounded-xl text-center z-50 p-3 absolute right-1">
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
          {user ? (
            <li
              className={`m-1.5 pl-1.5 pr-1.5 ${pathActive('/challenges/create') ? 'bg-(--button-select) bg-origin-padding p-1.5' : ''} rounded-full`}
            >
              <Link href="/challenges/create">Create challenge</Link>
            </li>
          ) : (
            <li
              className={`m-1.5 pl-1.5 pr-1.5 ${pathActive('/login-register/login') ? 'bg-(--button-select) bg-origin-padding p-1.5' : ''} rounded-full`}
            >
              <Link href="/login-register/login">Login</Link>
            </li>
          )}
          {user ? (
            <li
              className={`m-1.5 pl-1.5 pr-1.5 ${pathActive('/profile') ? 'bg-(--button-select) bg-origin-padding p-1.5' : ''} rounded-full`}
            >
              <Link href="/profile">Profile</Link>
            </li>
          ) : (
            <li
              className={`m-1.5 pl-1.5 pr-1.5 ${pathActive('/login-register/register') ? 'bg-(--button-select) bg-origin-padding p-1.5' : ''} rounded-full`}
            >
              <Link href="/login-register/register">Register</Link>
            </li>
          )}
          <li
            className={`m-1.5 pl-1.5 pr-1.5 ${pathActive('/support') ? 'bg-(--button-select) bg-origin-padding p-1.5' : ''} rounded-full`}
          >
            <Link href="/support">Support</Link>
          </li>
          <li>
            <ThemeToggle />
          </li>
          {user && (
            <li className="m-1.5 pl-1.5 pr-1.5">
              <LogoutButton />
            </li>
          )}
        </ul>
      )}
    </nav>
  );
}