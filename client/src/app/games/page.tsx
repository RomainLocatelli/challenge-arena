'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Petit hook responsive (sans event resize manuel côté composant)
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);

    onChange(); // init
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [query]);

  return matches;
}

export default function GamesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageBlockStart, setPageBlockStart] = useState(2);

  const ismd = useMediaQuery('(min-width: 768px)');
  const itemsPerPage = ismd ? 9 : 6;

  // TODO: remplacer par les jeux réels
  const games = [
    { id: 'elden-ring', title: 'Elden Ring', image: '/real-rat.png' },
    { id: 'dark-souls', title: 'Dark Souls', image: '/real-rat.png' },
    { id: 'dark-souls-ii', title: 'Dark Souls II', image: '/real-rat.png' },
    { id: 'dark-souls-iii', title: 'Dark Souls III', image: '/real-rat.png' },
    { id: 'bloodborne', title: 'Bloodborne', image: '/real-rat.png' },
    { id: 'sekiro-shadows-die-twice', title: 'Sekiro: Shadows Die Twice', image: '/real-rat.png' },
    { id: 'hollow-knight', title: 'Hollow Knight', image: '/real-rat.png' },
    { id: 'hades', title: 'Hades', image: '/real-rat.png' },
    { id: 'dead-cells', title: 'Dead Cells', image: '/real-rat.png' },
    { id: 'celeste', title: 'Celeste', image: '/real-rat.png' },
    { id: 'minecraft', title: 'Minecraft', image: '/real-rat.png' },
    { id: 'fortnite', title: 'Fortnite', image: '/real-rat.png' },
    {
      id: 'the-legend-of-zelda-breath-of-the-wild',
      title: 'The Legend of Zelda: Breath of the Wild',
      image: '/real-rat.png'
    },
    {
      id: 'the-legend-of-zelda-tears-of-the-kingdom',
      title: 'The Legend of Zelda: Tears of the Kingdom',
      image: '/real-rat.png'
    },
    { id: 'call-of-duty-warzone', title: 'Call of Duty: Warzone', image: '/real-rat.png' },
    { id: 'counter-strike-2', title: 'Counter-Strike 2', image: '/real-rat.png' },
    { id: 'valorant', title: 'VALORANT', image: '/real-rat.png' },
    { id: 'league-of-legends', title: 'League of Legends', image: '/real-rat.png' },
    { id: 'dota-2', title: 'Dota 2', image: '/real-rat.png' },
    { id: 'overwatch-2', title: 'Overwatch 2', image: '/real-rat.png' },
    { id: 'rocket-league', title: 'Rocket League', image: '/real-rat.png' },
    { id: 'grand-theft-auto-v', title: 'Grand Theft Auto V', image: '/real-rat.png' },
    { id: 'red-dead-redemption-2', title: 'Red Dead Redemption 2', image: '/real-rat.png' },
    { id: 'the-witcher-3-wild-hunt', title: 'The Witcher 3: Wild Hunt', image: '/real-rat.png' },
    { id: 'cyberpunk-2077', title: 'Cyberpunk 2077', image: '/real-rat.png' },
    { id: 'skyrim', title: 'The Elder Scrolls V: Skyrim', image: '/real-rat.png' },
    { id: 'fallout-4', title: 'Fallout 4', image: '/real-rat.png' },
    { id: 'stardew-valley', title: 'Stardew Valley', image: '/real-rat.png' },
    {
      id: 'animal-crossing-new-horizons',
      title: 'Animal Crossing: New Horizons',
      image: '/real-rat.png'
    },
    { id: 'super-mario-odyssey', title: 'Super Mario Odyssey', image: '/real-rat.png' },
    { id: 'mario-kart-8-deluxe', title: 'Mario Kart 8 Deluxe', image: '/real-rat.png' },
    {
      id: 'super-smash-bros-ultimate',
      title: 'Super Smash Bros. Ultimate',
      image: '/real-rat.png'
    },
    { id: 'god-of-war', title: 'God of War', image: '/real-rat.png' },
    { id: 'god-of-war-ragnarok', title: 'God of War Ragnarök', image: '/real-rat.png' },
    { id: 'the-last-of-us-part-i', title: 'The Last of Us Part I', image: '/real-rat.png' },
    { id: 'the-last-of-us-part-ii', title: 'The Last of Us Part II', image: '/real-rat.png' },
    { id: 'horizon-zero-dawn', title: 'Horizon Zero Dawn', image: '/real-rat.png' },
    { id: 'horizon-forbidden-west', title: 'Horizon Forbidden West', image: '/real-rat.png' },
    { id: 'ghost-of-tsushima', title: 'Ghost of Tsushima', image: '/real-rat.png' },
    {
      id: 'spider-man-remastered',
      title: 'Marvel’s Spider-Man Remastered',
      image: '/real-rat.png'
    },
    { id: 'spider-man-2', title: 'Marvel’s Spider-Man 2', image: '/real-rat.png' },
    { id: 'resident-evil-4', title: 'Resident Evil 4', image: '/real-rat.png' },
    { id: 'resident-evil-village', title: 'Resident Evil Village', image: '/real-rat.png' },
    { id: 'monster-hunter-world', title: 'Monster Hunter: World', image: '/real-rat.png' },
    { id: 'final-fantasy-vii-remake', title: 'Final Fantasy VII Remake', image: '/real-rat.png' },
    { id: 'final-fantasy-xvi', title: 'Final Fantasy XVI', image: '/real-rat.png' },
    { id: 'baldurs-gate-3', title: 'Baldur’s Gate 3', image: '/real-rat.png' },
    { id: 'persona-5-royal', title: 'Persona 5 Royal', image: '/real-rat.png' },
    { id: 'metroid-dread', title: 'Metroid Dread', image: '/real-rat.png' }
  ];

  const filteredGames = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return games;
    }
    return games.filter((g) => g.title.toLowerCase().includes(q));
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredGames.length / itemsPerPage));
  const adjustedCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  // Onn recale la page si besoin
  useEffect(() => {
    if (currentPage !== adjustedCurrentPage) {
      setCurrentPage(adjustedCurrentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage, totalPages]);

  const startIndex = (adjustedCurrentPage - 1) * itemsPerPage;
  const paginatedGames = filteredGames.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);

    // si on clique une page hors bloc, on recale le bloc autour
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
      // si la page actuelle était dans l'ancien bloc, on la garde,
      // sinon on met la première page du nouveau bloc
      const candidate = Math.min(pageBlockStart + 4, totalPages);
      return p === 1 ? candidate : p;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <main className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md md:max-w-2xl mx-auto">
            <div className="absolute inset-0 rounded-full bg-(--searchbar-color) ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.45)]" />
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
              placeholder="Search a game..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
                setPageBlockStart(2);
              }}
              className="relative w-full rounded-full bg-transparent py-3 pl-14 pr-4 text-white text-center text-xl placeholder:text-white/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Games Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6 border-l-4 border-purple-600 pl-3">Games</h2>

          {/* Games icons */}
          <div className="mx-auto w-65 grid grid-cols-2 gap-4 md:gap-6 md:w-150 md:grid-cols-3 lg:w-200">
            {paginatedGames.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="group overflow-hidden rounded-lg bg-slate-900 transition hover:ring-2 hover:ring-purple-600"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-slate-700 flex-none">
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    sizes="(max-width: 1023px) 50vw, 33vw"
                    className="object-contain"
                  />
                </div>
                <div className="p-3 h-14 min-w-0 flex-none">
                  <h3 className="min-w-0 overflow-hidden break-words line-clamp-2 font-semibold leading-5">
                    {game.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {filteredGames.length === 0 && (
          <p className="mt-6 text-center text-white/60">No game found.</p>
        )}

        {/* Pages */}
        <div className="flex justify-center gap-2 mb-12">
          {/* Page 1 toujours visible */}
          <button
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentPage === 1 ? 'bg-purple-600' : 'bg-slate-800 hover:bg-slate-700'
            }`}
            onClick={() => goToPage(1)}
          >
            1
          </button>

          {/* Les 4 pages du bloc */}
          {Array.from({ length: 4 }, (_, i) => pageBlockStart + i).map((page) => (
            <button
              key={page}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentPage === page ? 'bg-purple-600' : 'bg-slate-800 hover:bg-slate-700'
              }`}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          ))}

          {/* Bouton ... : passe au bloc suivant */}
          <button
            type="button"
            className="w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center"
            onClick={nextBlock}
            aria-label="Afficher les pages suivantes"
          >
            ...
          </button>
        </div>
      </main>
    </div>
  );
}
