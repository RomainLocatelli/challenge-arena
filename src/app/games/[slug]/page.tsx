'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
  title: string;
  imageUrl: string;
  description?: string;
  slug: string;
};

type Challenge = {
  id: string;
  slug?: string;
  title: string;
  description: string;
  gameId: string;
  voteCount: number;
  hasLiked?: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  scoreFormat: string;
  game?: {
    id: string;
    slug: string;
    title: string;
    imageUrl: string;
    description?: string;
  };
};

const formatVotes = (n?: number) => `${n ?? 0}`;

export default function GamePage() {
  const params = useParams() as { slug?: string } | undefined;
  const slug = params?.slug;

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageBlockStart, setPageBlockStart] = useState(2);

  const [games, setGames] = useState<Game[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  const ismd = useMediaQuery('(min-width: 768px)');
  const itemsPerPage = ismd ? 6 : 4;

  // Fetch games (for selected game card)
  useEffect(() => {
    async function fetchGames() {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${baseUrl}/games`);
      const data = await res.json();
      setGames(data.games || []);
    }
    fetchGames();
  }, []);

  // Fetch challenges
  useEffect(() => {
    async function fetchChallenges() {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${baseUrl}/challenges`);
      const data = await res.json();

      const list = (data.challenges || data || []).map((c: Partial<Challenge>) => ({
        ...c,
        voteCount: (c as any).voteCount ?? 0
      })) as Challenge[];

      setChallenges(list);
    }
    fetchChallenges();
  }, []);

  // Selected game by slug (id)
  const selectedGame = useMemo(() => {
    if (!slug) {
      return null;
    }
    return games.find((g) => g.slug === slug) ?? null;
  }, [slug, games]);

  // Reset when slug changes
  useEffect(() => {
    setSearchQuery('');
    setCurrentPage(1);
    setPageBlockStart(2);
  }, [slug]);

  // Filter challenges for selected game + search
  const filteredChallenges = useMemo(() => {
    // If no slug, return empty
    if (!slug) {
      return [];
    }

    // find the game using the slug
    const currentGame = games.find((g) => g.slug === slug);

    // Si le jeu n'existe pas, retourne tableau vide
    if (!currentGame) {
      return [];
    }

    const searchTerm = searchQuery.trim().toLowerCase();
    // Keep only the games challenge
    return challenges.filter((challenge) => {
      if (challenge.gameId !== currentGame.id) {
        return false;
      }

      if (!searchTerm) {
        return true;
      }

      const challengeTitle = challenge.title.toLowerCase();
      const gameTitle = (challenge.game?.title ?? currentGame.title).toLowerCase();

      return challengeTitle.includes(searchTerm) || gameTitle.includes(searchTerm);
    });
  }, [searchQuery, challenges, slug, games]);

  function extractShortDescription(raw: string) {
    const text = (raw ?? '').replace(/\r\n/g, '\n').trim();
    const idx = text.search(/\n\s*details\s*:?\s*\n/i);

    if (idx === -1) {
      return text;
    }
    return text.slice(0, idx).trim();
  }

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredChallenges.length / itemsPerPage));
  const effectivePage = Math.min(Math.max(1, currentPage), totalPages);

  useEffect(() => {
    if (currentPage !== effectivePage) {
      setCurrentPage(effectivePage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage, totalPages]);

  const startIndex = (effectivePage - 1) * itemsPerPage;
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
    setCurrentPage((p) => {
      const candidate = Math.min(pageBlockStart + 4, totalPages);
      return p === 1 ? candidate : p;
    });
  };

  return (
    <div className="min-h-screen  flex flex-col">
      <main className="px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
        {/* Selected Game card */}
        {selectedGame ? (
          <div className="mb-4 max-w-md md:max-w-2xl mx-auto">
            <div className="relative w-full h-44 md:h-56 overflow-hidden rounded-2xl bg-(--background-header) ring-1 ring-background shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
              <Image
                src={selectedGame.imageUrl}
                alt={selectedGame.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-contain p-4"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-foreground/60 to-transparent">
                <div className="text-lg font-semibold text-center text-(--button-select)">
                  {selectedGame.title}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md md:max-w-2xl mx-auto">
            <div className="absolute inset-0 rounded-full bg-(--searchbar-color) ring-1 ring-background/10 shadow-[0_10px_30px_rgba(0,0,0,0.45)]" />
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
          </div>
        </div>

        {/* Challenges Section */}
        <div className="mb-8">
          <div className="mx-auto max-w-md md:max-w-4xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold border-l-4 border-(--button-select) pl-3">
                Challenges
              </h2>

              <Link
                href="/challenges/create"
                className="px-4 py-2 rounded-xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) text-sm font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
              >
                Create a challenge
              </Link>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {paginatedChallenges.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl bg-(--background-header)/70 ring-1 ring-background/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden"
                >
                  <div className="p-5 flex flex-col h-full">
                    {/* Tag / game */}
                    <div className="text-xs font-semibold tracking-widest text-(--button-select)/90 mb-2">
                      {(c.game?.title ?? selectedGame?.title ?? '').toUpperCase()}
                    </div>

                    <div className="text-2xl font-semibold leading-tight mb-2">{c.title}</div>
                    <div className="text-foreground/70 leading-relaxed mb-4">
                      {extractShortDescription(c.description)}
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3 text-foreground/70">
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
                          <span className="text-sm font-semibold">{formatVotes(c.voteCount)}</span>
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
              ))}
            </div>
          </div>
        </div>

        {/* Empty state */}
        {filteredChallenges.length === 0 && (
          <p className="mt-6 text-center">No challenge for this game yet</p>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-2 mb-12">
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

          {Array.from({ length: 4 }, (_, i) => pageBlockStart + i)
            .filter((p) => p <= totalPages)
            .map((page) => (
              <button
                key={page}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentPage === page
                    ? 'bg-(--button-select)'
                    : 'bg-(--button-area) hover:bg-(--searchbar-color)'
                }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}

          {totalPages > pageBlockStart + 3 && (
            <button
              type="button"
              className="w-8 h-8 bg-(--button-area) bg-(--searchbar-color)rounded-full flex items-center justify-center"
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
