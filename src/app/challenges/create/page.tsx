'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type RawgGame = {
  id: number;
  slug: string;
  name: string;
  background_image: string | null;
};

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

// Description avec max 100 chars
const clamp100 = (s: string) => {
  const t = (s ?? '').trim();
  if (t.length <= 100) {
    return t;
  }
  return `${t.slice(0, 97)}...`;
};

// OBSOLETE - Code remplacé par l'autocomplete RAWG
// type GameOption = {
//   id: string;
//   title: string;
//   imageUrl?: string;
// };

export default function CreateChallengePage() {
  const router = useRouter();

  const isMd = useMediaQuery('(min-width: 768px)');

  // TODO: remplacer par session user
  const currentUserName = 'NailMaster';

  // TODO: remplacer par fetch / BDD (liste de jeux)
  const games: GameOption[] = useMemo(
    () => [
      { id: 'hollow-knight', title: 'Hollow Knight', imageUrl: '/real-rat.png' },
      { id: 'elden-ring', title: 'Elden Ring', imageUrl: '/real-rat.png' },
      { id: 'skyrim', title: 'The Elder Scrolls V: Skyrim', imageUrl: '/real-rat.png' }
    ],
    []
  );

  // Etat du formulaire (mode "edit" uniquement)
  const [title, setTitle] = useState('');
  const [createdBy, setCreatedBy] = useState('NailMaster'); // TODO: session user
  // OBSOLETE: Remplacé par selectedGame (RawgGame)
  // const [gameId, setGameId] = useState(games[0]?.id ?? "");
  const [imageUrl, setImageUrl] = useState<string>('');
  const [description, setDescription] = useState('');
  const [detailsPoints, setDetailsPoints] = useState<string[]>([]);
  // Autocomplete states
  const [selectedGame, setSelectedGame] = useState<RawgGame | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<RawgGame[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Score format
  const [scoreFormat, setScoreFormat] = useState('');

  // OBSOLETE: Remplacé par selectedGame state
  // const selectedGame = useMemo(
  //   () => games.find((g) => g.id === gameId) ?? null,
  //   [games, gameId]
  // );

  // Fonction de recherche
  const searchGames = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `http://localhost:3000/games/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setSearchResults(data.results || []);
      setShowDropdown(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce manuel
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchGames(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // OBSOLETE: imageUrl remplacé par background_image
  // const headerImage = imageUrl.trim()
  //\ ? imageUrl.trim()
  //   : selectedGame?.imageUrl || "/real-rat.png";

  const headerImage = imageUrl.trim()
    ? imageUrl.trim()
    : selectedGame?.background_image || '/real-rat.png';

  // Gestion des lignes à puces (details)
  const addBullet = () => setDetailsPoints((p) => [...p, '']);
  const updateBullet = (idx: number, val: string) =>
    setDetailsPoints((p) => p.map((x, i) => (i === idx ? val : x)));
  const removeBullet = (idx: number) => setDetailsPoints((p) => p.filter((_, i) => i !== idx));

  // const canCreate = useMemo(() => {
  //   const t = title.trim();
  //   const d = description.trim();
  //   return Boolean(gameId) && t.length > 0 && d.length > 0;
  // }, [gameId, title, description]);

  const canCreate = useMemo(() => {
    const t = title.trim();
    const d = description.trim();
    const sf = scoreFormat.trim();
    return Boolean(selectedGame) && t.length > 0 && d.length > 0 && sf.length > 0;
  }, [selectedGame, title, description, scoreFormat]);

  const createChallenge = async () => {
    if (!selectedGame) return;

    // Construire la description complète : description + details
    const fullDescription = [
      description.trim(),
      ...detailsPoints.map((point) => point.trim()).filter(Boolean)
    ]
      .filter(Boolean)
      .join('\n');

    const payload = {
      title: title.trim(),
      scoreFormat: scoreFormat.trim(),
      description: fullDescription,
      gameId: selectedGame.id,
      gameTitle: selectedGame.name,
      gameSlug: selectedGame.slug,
      gameImageUrl: selectedGame.background_image || ''
    };

    try {
      const response = await fetch('http://localhost:3000/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // TODO: Ajouter le token JWT ici quand l'auth sera en place
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create challenge');
      }

      const data = await response.json();

      // Redirige vers le challenge créé
      router.push(`/challenge/${data.challenge.slug}`);
    } catch (error) {
      console.error('Error creating challenge:', error);
      alert('Erreur lors de la création du challenge. Vérifie la console.');
    }
  };

  return (
    <div className="min-h-screen  ">
      <main className="mx-auto w-full max-w-[430px] md:max-w-5xl px-4 md:px-8 py-5 md:py-8">
        {/* Card principale */}
        <div className="rounded-3xl bg-background/70 ring-1 ring-background/10 shadow-[0_20px_60px_rgba(0,0,0,0.55)] overflow-hidden">
          {/* Header */}
          <div className="relative h-32 md:h-48 lg:h-64 w-full bg-(--button-area)">
            <Image
              src={headerImage}
              alt={title || 'New challenge'}
              fill
              sizes="(max-width: 767px) 430px, 1024px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/65 via-foreground/15 to-transparent" />
          </div>

          {/* Contenu */}
          <div className="p-5 md:p-8">
            {/* Title */}
            <div className="flex items-start justify-between gap-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-foreground/40 ring-1 ring-background/10 rounded-xl px-3 py-2 text-2xl md:text-4xl font-semibold focus:outline-none text-center"
                placeholder="Challenge title"
              />
            </div>

            {/* Meta (Game + Created by) */}
            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="text-background/80 space-y-2">
                <div className="text-sm">
                  <span className="text-background/60">Game :</span>{' '}
                  <div className="relative ml-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowDropdown(true)}
                      className="bg-foreground/40 ring-1 ring-background/10 rounded-xl px-3 py-2 text-sm focus:outline-none w-64"
                      placeholder="Search for a game..."
                    />

                    {isSearching && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="animate-spin h-4 w-4 border-2 border-background/20 border-t-background rounded-full" />
                      </div>
                    )}

                    {showDropdown && searchResults.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-(--background-header) ring-1 ring-background/10 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.map((game) => (
                          <button
                            key={game.id}
                            type="button"
                            onClick={() => {
                              setSelectedGame(game);
                              setSearchQuery(game.name);
                              setShowDropdown(false);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-(--button-area) flex items-center gap-3 text-sm"
                          >
                            {game.background_image && (
                              <img
                                src={game.background_image}
                                alt={game.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <span>{game.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedGame && (
                    <div className="mt-2 text-xs text-background/70">
                      Selected: <span className="font-semibold">{selectedGame.name}</span>
                    </div>
                  )}
                </div>

                <div className="text-sm">
                  <span className="text-background/60">Created by</span>{' '}
                  <span className="font-semibold">{currentUserName}</span>
                </div>
              </div>
            </div>

            {/* Image URL */}
            <div className="mt-4">
              <div className="text-sm font-semibold text-background/80 mb-2">Image URL</div>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-foreground/40 ring-1 ring-background/10 rounded-xl px-3 py-2 text-sm focus:outline-none"
                placeholder="https://..."
              />
              <div className="text-xs text-background/50 mt-2">
                Laisse vide pour afficher l’image du jeu par défaut.
              </div>
            </div>

            {/* Score Format */}
            <div className="mt-4">
              <div className="text-sm font-semibold text-background/80 mb-2">Score Format</div>
              <input
                value={scoreFormat}
                onChange={(e) => setScoreFormat(e.target.value)}
                className="w-full bg-foreground/40 ring-1 ring-background/10 rounded-xl px-3 py-2 text-sm focus:outline-none"
                placeholder="e.g., SCORE, TIME, KILLS, etc."
              />
              <div className="text-xs text-background/50 mt-2">
                Comment sera mesuré le succès du challenge (ex: SCORE, TIME, DISTANCE...)
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-1 rounded-full bg-(--button-select)" />
                  <div className="font-semibold">Description :</div>
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-foreground/30 ring-1 ring-background/10 p-3">
                <div className="flex items-start gap-3">
                  <textarea
                    value={description}
                    maxLength={100}
                    onChange={(e) => setDescription(e.target.value)}
                    className="flex-1 bg-foreground/40 ring-1 ring-background/10 rounded-xl px-3 py-2 text-sm focus:outline-none resize-none min-h-[44px]"
                    placeholder="Description (max 100 chars)"
                  />
                  <div className="text-xs text-background/50 w-12 text-right pt-2">
                    {description.length}/100
                  </div>
                </div>
              </div>
            </div>

            {/* Challenge Details */}
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-1 rounded-full bg-(--button-select)" />
                  <div className="font-semibold">Challenge Details :</div>
                </div>

                <button
                  type="button"
                  onClick={addBullet}
                  className="text-sm text-background/70 hover:text-background"
                >
                  + Add
                </button>
              </div>

              <div className="mt-3 rounded-2xl bg-foreground/30 ring-1 ring-background/10 p-3">
                <ul className="space-y-2">
                  {detailsPoints.map((txt, idx) => (
                    <li key={`det-${idx}`} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-background/70 shrink-0" />
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          value={txt}
                          onChange={(e) => updateBullet(idx, e.target.value)}
                          className="flex-1 bg-foreground/40 ring-1 ring-background/10 rounded-xl px-3 py-2 text-sm focus:outline-none"
                          placeholder={`Detail ${idx + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeBullet(idx)}
                          className="px-3 py-2 rounded-xl bg-(--background-header) hover:bg-(--button-area) ring-1 ring-background/10 text-sm"
                          aria-label="Remove detail item"
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                {detailsPoints.length === 0 ? (
                  <div className="text-sm text-background/60">No details yet. Add one.</div>
                ) : null}
              </div>
            </div>

            {/* Create */}
            <div className="mt-6 flex justify-center md:justify-end">
              <button
                type="button"
                disabled={!canCreate}
                onClick={createChallenge}
                className={`px-10 py-3 rounded-full font-semibold shadow-[0_10px_25px_rgba(0,0,0,0.45)] ${
                  canCreate
                    ? 'bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover)'
                    : 'bg-(--button-select) text-background/50 cursor-not-allowed'
                }`}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
