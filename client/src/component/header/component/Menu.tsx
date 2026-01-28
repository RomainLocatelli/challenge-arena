'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Menu() {
  const pathname = usePathname();
  const pathActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <nav className="hidden lg:block lg:content-center">
      <ul className="lg:flex">
        <li className="m-2">
          <Link 
            href="/"
            className={`block p-2 pr-4 pl-4 rounded-3xl font-semibold text-white transition-all ${
              pathActive('/')
                ? 'bg-[var(--button-select)] shadow-md shadow-[#7c39ed]/30'
                : 'bg-transparent border-2 border-[var(--button-select)] hover:bg-[var(--button-game-challenge-hover)] hover:scale-105 hover:shadow-xl hover:shadow-[#7c39ed]/50'
            }`}
          >
            Home
          </Link>
        </li>
        
        <li className="m-2">
          <Link 
            href="/games"
            className={`block p-2 pr-4 pl-4 rounded-3xl font-semibold text-white transition-all ${
              pathActive('/games')
                ? 'bg-[var(--button-select)] shadow-md shadow-[#7c39ed]/30'
                : 'bg-transparent border-2 border-[var(--button-select)] hover:bg-[var(--button-game-challenge-hover)] hover:scale-105 hover:shadow-xl hover:shadow-[#7c39ed]/50'
            }`}
          >
            Games
          </Link>
        </li>
        
        <li className="m-2">
          <Link 
            href="/challenges"
            className={`block p-2 pr-4 pl-4 rounded-3xl font-semibold text-white transition-all ${
              pathActive('/challenges')
                ? 'bg-[var(--button-select)] shadow-md shadow-[#7c39ed]/30'
                : 'bg-transparent border-2 border-[var(--button-select)] hover:bg-[var(--button-game-challenge-hover)] hover:scale-105 hover:shadow-xl hover:shadow-[#7c39ed]/50'
            }`}
          >
            Challenges
          </Link>
        </li>
        
        <li className="m-2">
          <Link 
            href="/leaderboard"
            className={`block p-2 pr-4 pl-4 rounded-3xl font-semibold text-white transition-all ${
              pathActive('/leaderboard')
                ? 'bg-[var(--button-select)] shadow-md shadow-[#7c39ed]/30'
                : 'bg-transparent border-2 border-[var(--button-select)] hover:bg-[var(--button-game-challenge-hover)] hover:scale-105 hover:shadow-xl hover:shadow-[#7c39ed]/50'
            }`}
          >
            Leaderboard
          </Link>
        </li>
      </ul>
    </nav>
  );
}