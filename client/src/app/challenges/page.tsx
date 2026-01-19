'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// hook responsive
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);

    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [query]);

  return matches;
}

type Game = {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
};

type Challenge = {
  id: string;
  slug: string;
  title: string;
  scoreFormat: boolean;
  description: string;
  createdBy: string;
  gameId: string;
  createdAt: string;
  updatedAt: string;
  game: Game;
};

type Game = {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
};
export default function ChallengesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageBlockStart, setPageBlockStart] = useState(2);

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const ismd = useMediaQuery('(min-width: 768px)');
  const itemsPerPage = ismd ? 6 : 4;

  /* ======================
     API CALLS
  ====================== */

  useEffect(() => {
    async function fetchGames() {
      const baseUrl = process.env.API_URL || '';
      const res = await fetch(`${baseUrl}games`);
      const data = await res.json();
      setGames(data.games || []);
    }

    fetchGames();
  }, []);

  useEffect(() => {
    async function fetchChallenges() {
      const baseUrl = process.env.API_URL || '';
      const res = await fetch(`${baseUrl}challenges`);
      const data = await res.json();
      setChallenges(data.challenges || data || []);
    }

    fetchChallenges();
  }, []);

  /* ======================
     FILTERING
  ====================== */

  const filteredChallenges = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return challenges.filter((c) => {
      const matchesGame = !selectedGameId || c.gameId === selectedGameId;

      if (!q) return matchesGame;

      const matchesQuery =
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.game.title.toLowerCase().includes(q);

      return matchesGame && matchesQuery;
    });
  }, [searchQuery, selectedGameId, challenges]);

  /* ======================
     PAGINATION
  ====================== */

  const totalPages = Math.max(1, Math.ceil(filteredChallenges.length / itemsPerPage));
  const adjustedCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  useEffect(() => {
    if (currentPage !== adjustedCurrentPage) {
      setCurrentPage(adjustedCurrentPage);
    }
  }, [adjustedCurrentPage, currentPage]);

  const startIndex = (adjustedCurrentPage - 1) * itemsPerPage;
  const paginatedChallenges = filteredChallenges.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);

    if (page === 1) {
      setPageBlockStart(2);
      return;
    }
    if (page < pageBlockStart) {
      setPageBlockStart(page);
    }
    if (page > pageBlockStart + 3) {
      setPageBlockStart(page - 3);
    }
  };

  const nextBlock = () => {
    const maxStart = Math.max(2, totalPages - 3);
    setPageBlockStart((s) => Math.min(s + 4, maxStart));
    setCurrentPage((p) => (p === 1 ? Math.min(pageBlockStart + 4, totalPages) : p));
  };

  /* ======================
     RENDER
  ====================== */

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <main className="px-4 md:px-8 py-6 max-w-7xl mx-auto w-full flex flex-col flex-1">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search a challenge..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
              setPageBlockStart(2);
            }}
            className="w-full max-w-2xl mx-auto block rounded-full bg-slate-900 py-3 px-6 text-center"
          />
        </div>

        <div className="flex flex-col">
          {/* Challenges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedChallenges.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl bg-slate-900/70 ring-1 ring-white/10 p-5 flex flex-col"
              >
                <div className="text-xs font-semibold tracking-widest text-purple-300 mb-2">
                  {c.game.title.toUpperCase()}
                </div>
                <div className="text-2xl font-semibold mb-2">{c.title}</div>
                <div className="text-white/70 mb-4">{c.description}</div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="text-sm text-white/50">likes</div>
                  <Link
                    href={`/challenges/${c.slug}`}
                    className="px-4 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-sm font-semibold"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {filteredChallenges.length === 0 && (
            <p className="mt-8 text-center text-white">No challenge found.</p>
          )}
          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-10 align-bottom">
            <button
              className={`w-8 h-8 rounded-full ${currentPage === 1 ? 'bg-purple-600' : 'bg-slate-800'}`}
              onClick={() => goToPage(1)}
            >
              1
            </button>
            {Array.from({ length: 4 }, (_, i) => pageBlockStart + i)
              .filter((p) => p <= totalPages)
              .map((page) => (
                <button
                  key={page}
                  className={`w-8 h-8 rounded-full ${
                    currentPage === page ? 'bg-purple-600' : 'bg-slate-800'
                  }`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}
            {totalPages > pageBlockStart + 3 && (
              <button className="w-8 h-8 rounded-full bg-slate-800" onClick={nextBlock}>
                ...
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
