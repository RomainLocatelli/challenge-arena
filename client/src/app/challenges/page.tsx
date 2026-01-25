'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

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

type Game = { id: string; title: string; imageUrl: string };
type Challenge = {
  createdAt: string;
  createdBy: string;
  description: string;
  game: {
    id: string;
    title: string;
    imageUrl: string;
    description: string;
  };
  gameId: string;
  id: string;
  // optional slug used for links
  slug?: string;
  scoreFormat: string;
  title: string;
  updatedAt: string;
  voteCount: number;
  // optional flag indicating whether the current user has liked the challenge
  hasLiked?: boolean;
};

const formatVotes = (n: number) => {
  return `${n}`;
};

// Search filter function
function filterOrderingChallenges(
  challenges: Challenge[],
  orderFilterSearchbar: string,
  filterSelectorChoice: string
) {
  const sorted = [...challenges];
  if (filterSelectorChoice === 'Popularity') {
    sorted.sort((a, b) => {
      if (orderFilterSearchbar === 'ASC') {
        return a.voteCount - b.voteCount;
      } else {
        return b.voteCount - a.voteCount;
      }
    });
  } else if (filterSelectorChoice === 'Date added') {
    sorted.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      if (orderFilterSearchbar === 'ASC') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
  } else {
    sorted.sort((a, b) => {
      if (orderFilterSearchbar === 'ASC') {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
  }
  return sorted;
}

export default function ChallengesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageBlockStart, setPageBlockStart] = useState(2);

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [filterModalArea, setFilterModalArea] = useState<boolean>(false);

  const [orderFilterSearchbar, setOrderFilterSearchBar] = useState<'ASC' | 'DESC'>('ASC');
  const [filterSelectorChoice, setFilterSelectorChoice] = useState<
    'Popularity' | 'Date added' | 'Alphabetical'
  >('Date added');

  const ismd = useMediaQuery('(min-width: 768px)');
  const itemsPerPage = ismd ? 6 : 4;

  /* ======================
     API CALLS
  ====================== */

  useEffect(() => {
    async function fetchGames() {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${baseUrl}/games`);
      const data = await res.json();
      setGames(data.games || []);
    }

    fetchGames();
  }, []);

  useEffect(() => {
    async function fetchChallenges() {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${baseUrl}/challenges`);
      const data = await res.json();

      // on s'assure que voteCount existe
      const list = (data.challenges || data || []).map((c: Partial<Challenge>) => ({
        ...c,
        voteCount: c.voteCount ?? 0
      })) as Challenge[];

      setChallenges(list);
    }

    fetchChallenges();
  }, []);

  function extractShortDescription(raw: string) {
    const text = (raw ?? '').replace(/\r\n/g, '\n').trim();

    // coupe dès qu’on voit une ligne "Details" (avec ou sans :)
    const idx = text.search(/\n\s*details\s*:?\s*\n/i);

    if (idx === -1) {
      return text;
    }
    return text.slice(0, idx).trim();
  }

  /* ======================
     FILTERING
  ====================== */

  const filteredChallenges = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return challenges.filter((c) => {
      const matchesGame = !selectedGameId || c.gameId === selectedGameId;

      if (!q) {
        return matchesGame;
      }

      const matchesQuery =
        c.title.toLowerCase().includes(q) || c.game.title.toLowerCase().includes(q);

      return matchesGame && matchesQuery;
    });
  }, [searchQuery, selectedGameId, challenges]);

  /* ======================
     SORTING
  ====================== */

  const sortedChallenges = useMemo(() => {
    return filterOrderingChallenges(filteredChallenges, orderFilterSearchbar, filterSelectorChoice);
  }, [filteredChallenges, orderFilterSearchbar, filterSelectorChoice]);

  /* ======================
     PAGINATION
  ====================== */

  const totalPages = Math.max(1, Math.ceil(sortedChallenges.length / itemsPerPage));
  const effectivePage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (effectivePage - 1) * itemsPerPage;
  const paginatedChallenges = sortedChallenges.slice(startIndex, startIndex + itemsPerPage);

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
    <div className="min-h-screen flex flex-col">
      <main className="px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md md:max-w-2xl mx-auto">
            <div className="absolute inset-0 rounded-full bg-(--searchbar-color) ring-1 ring-foreground/10 shadow-[0_10px_30px_rgba(0,0,0,0.45)]" />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-12 w-12 flex items-center justify-center shadow">
              <Image
                src="/loupe.png"
                width={100}
                height={100}
                alt="Search Icon"
                className="opacity-80"
              />
            </div>

            <input
              type="text"
              placeholder="Search a challenge..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
                setPageBlockStart(2);
              }}
              className="relative w-full rounded-full bg-transparent py-3 pl-14 pr-4  text-center text-xl  focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setFilterModalArea(!filterModalArea);
              }}
              className="absolute bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) rounded-full top-1/2 right-3 -translate-y-1/2 z-8 h-10 w-10 flex items-center justify-center shadow"
            >
              <Image
                src="/filter.png"
                width={100}
                height={100}
                alt="Search Icon"
                className="opacity-80"
              />
            </button>
          </div>
          {/* Modal filter menu */}
          {filterModalArea ? (
            <div className="absolute flex items-center-safe justify-center bg-(--modal-filter-searchebar) p-5 rounded-4xl left-1/5 lg:left-1/3 lg:right-1/3">
              <p className="mr-3">Filter :</p>
              <div className="gap-2 m-2 flex flex-col ">
                <button
                  type="button"
                  onClick={() => {
                    setOrderFilterSearchBar('ASC');
                  }}
                  className="bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) rounded-4xl p-1"
                >
                  Ascending ⬆️
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOrderFilterSearchBar('DESC');
                  }}
                  className="bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) rounded-4xl p-1"
                >
                  Descending ⬇️
                </button>
              </div>
              <div className="gap-2 m-2 flex flex-col">
                <button
                  type="button"
                  onClick={() => {
                    setFilterSelectorChoice('Popularity');
                  }}
                  className="bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) rounded-4xl p-1"
                >
                  Popularity
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilterSelectorChoice('Date added');
                  }}
                  className="bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) rounded-4xl p-1"
                >
                  Date added
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilterSelectorChoice('Alphabetical');
                  }}
                  className="bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) rounded-4xl p-1"
                >
                  Alphabetical
                </button>
              </div>
            </div>
          ) : (
            <p></p>
          )}
        </div>

        {/* Challenges Section */}
        <div className="mb-8">
          <div className="mx-auto max-w-md md:max-w-4xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold border-l-4 border-(--button-select) pl-3">
                Challenges
              </h2>
              {user ? (
                <Link
                  href="/challenges/create"
                  className="px-4 py-2 rounded-xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) text-sm font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
                >
                  Create a challenge
                </Link>
              ) : (
                <div>
                  <p>To create a challenge, register or login </p>
                  <nav className="flex justify-center mb-8">
                    <Link href="/login-register/login">
                      <button
                        type="button"
                        className="bg-(--button-area) p-3 rounded-3xl mr-8 mt-6 cursor-pointer"
                      >
                        Login
                      </button>
                    </Link>
                    <Link href="/login-register/register">
                      <button
                        type="button"
                        className="bg-(--button-select) p-3 rounded-3xl  mt-6 cursor-pointer"
                      >
                        Register
                      </button>
                    </Link>
                  </nav>
                </div>
              )}
            </div>

            {/* Cards de challenges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {paginatedChallenges.map((c) => {
                return (
                  <div
                    key={c.id}
                    className="rounded-2xl bg-(--button-area) ring-1 ring-foreground/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden"
                  >
                    <div className="p-5 flex flex-col h-full">
                      {/* Tag / jeu */}
                      <div className="text-xs font-semibold tracking-widest text-(--button-select)/90 mb-2">
                        {(c.game?.title ?? '').toUpperCase()}
                      </div>

                      {/* Titre */}
                      <div className="text-2xl font-semibold leading-tight mb-2">{c.title}</div>

                      {/* Description */}
                      <div className="text-foreground/70 leading-relaxed mb-4">
                        {extractShortDescription(c.description)}
                      </div>

                      {/* votes + bouton */}
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center gap-3 ">
                          <span className="relative w-8 h-8 shrink-0">
                            <Image
                              src={c.hasLiked ? '/like 1.png' : '/like 0.png'}
                              alt={c.hasLiked ? 'Liked' : 'Not liked'}
                              fill
                              sizes="32px"
                              style={{ objectFit: 'contain' }}
                            />
                          </span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm font-semibold">
                              {formatVotes(c.voteCount)}
                            </span>
                            <span className="text-sm">likes</span>
                          </div>
                        </div>

                        <Link
                          href={`/challenges/${c.slug ?? c.id}`}
                          className="px-4 py-2 rounded-xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) text-sm font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {filteredChallenges.length === 0 && (
          <p className="mt-6 text-center ">
            {selectedGameId ? 'No challenge for this game yet' : 'No challenge found.'}
          </p>
        )}

        {/* Pages */}
        <div className="flex justify-center gap-2 mb-12">
          {/* Page 1 toujours visible */}
          <button
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentPage === 1
                ? 'bg-(--button-select)'
                : 'bg-(--button-area) hover:bg-(--searchbar-color)'
            }`}
            onClick={() => goToPage(1)}
          >
            1
          </button>

          {/* Les 4 pages du bloc */}
          {Array.from({ length: 4 }, (_, i) => pageBlockStart + i)
            .filter((p) => p <= totalPages)
            .map((page) => (
              <button
                key={page}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentPage === page
                    ? 'bg-(--button-select)'
                    : 'bg-(--button-area) hover:bg-(--background-header)'
                }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}

          {/* Bouton ... : passe au bloc suivant */}
          {totalPages > pageBlockStart + 3 && (
            <button
              type="button"
              className="w-8 h-8 bg-(--button-area) hover:bg-(--background-header) rounded-full flex items-center justify-center"
              onClick={nextBlock}
              aria-label="Afficher les pages suivantes"
            >
              ...
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
