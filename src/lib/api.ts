const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Interface qui correspond au modèle Game de Prisma
export interface Game {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
  description: string;
}

// Interface pour les résultats de recherche RAWG
export interface GameSearchResult {
  id: number;
  slug: string;
  name: string;
  background_image: string;
}

/**
 * Récupère tous les jeux depuis la base de données
 */
export async function fetchGames(): Promise<Game[]> {
  try {
    const res = await fetch(`${API_URL}/games`);

    if (!res.ok) {
      throw new Error(`Failed to fetch games: ${res.status}`);
    }

    const data = await res.json();
    return data.games;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
}

/**
 * Recherche des jeux via l'API RAWG (pour l'autocompletion)
 */
export async function searchGames(query: string): Promise<GameSearchResult[]> {
  try {
    const res = await fetch(`${API_URL}/games/search?q=${encodeURIComponent(query)}`);

    if (!res.ok) {
      throw new Error(`Failed to search games: ${res.status}`);
    }

    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error('Error searching games:', error);
    throw error;
  }
}

/**
 * Récupère un jeu par son ID avec ses challenges
 */
export async function fetchGameById(id: string): Promise<Game> {
  try {
    const res = await fetch(`${API_URL}/games/${id}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch game: ${res.status}`);
    }

    const data = await res.json();
    return data.game;
  } catch (error) {
    console.error('Error fetching game:', error);
    throw error;
  }
}


// ✅ Types pour la page challenge details
export interface ChallengeParticipation {
  id: string;
  userId: string;
  name: string;
  description: string;
  scoreLabel: string;
  link?: string;
  hasLiked?: boolean;
  likes: number;
}

export interface ChallengeDetails {
  id: string;
  slug: string;
  title: string;
  gameId: string;
  gameTitle: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  image?: string;
  gameImage: string;
  description: string[];
  details: string[];
  hasLiked?: boolean;
  likes: number;
  participations: ChallengeParticipation[];
}

// -----------------------------
// ✅ Challenge details
// -----------------------------
export async function fetchChallengeBySlug(slug: string): Promise<ChallengeDetails> {
  const res = await fetch(`${API_URL}/api/challenges/${slug}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(await res.text().catch(() => `Failed (${res.status})`));
  }
  return res.json();
}

// -----------------------------
// ✅ Challenge like toggle
// -----------------------------
export async function toggleChallengeLike(slug: string): Promise<{ ok: true; hasLiked: boolean; likes: number }> {
  const res = await fetch(`${API_URL}/api/challenges/${slug}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    throw new Error(await res.text().catch(() => `Failed (${res.status})`));
  }
  return res.json();
}

// -----------------------------
// ✅ Update challenge (title/image/details/description)
// -----------------------------
export async function updateChallenge(
  slug: string,
  payload: { title?: string; imageUrl?: string | null; description?: string | string[]; details?: string[] }
): Promise<{ ok: true }> {
  const res = await fetch(`${API_URL}/api/challenges/${slug}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(await res.text().catch(() => `Failed (${res.status})`));
  }
  return res.json();
}

// -----------------------------
// ✅ Create participation
// -----------------------------
export async function createParticipation(
  slug: string,
  payload: { description: string; submissionUrl?: string }
): Promise<{ ok: true; participation: ChallengeParticipation }> {
  const res = await fetch(`${API_URL}/api/challenges/${slug}/participations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(await res.text().catch(() => `Failed (${res.status})`));
  }
  return res.json();
}

// -----------------------------
// ✅ Update participation
// -----------------------------
export async function updateParticipation(
  id: string,
  payload: { description?: string; submissionUrl?: string }
): Promise<{ ok: true; participation: ChallengeParticipation }> {
  const res = await fetch(`${API_URL}/api/participations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(await res.text().catch(() => `Failed (${res.status})`));
  }
  return res.json();
}

// -----------------------------
// ✅ Delete participation
// -----------------------------
export async function deleteParticipation(id: string): Promise<{ ok: true }> {
  const res = await fetch(`${API_URL}/api/participations/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(await res.text().catch(() => `Failed (${res.status})`));
  }
  return res.json();
}

// -----------------------------
// ✅ Participation like toggle
// -----------------------------
export async function toggleParticipationLike(
  id: string
): Promise<{ ok: true; hasLiked: boolean; likes: number }> {
  const res = await fetch(`${API_URL}/api/participations/${id}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    throw new Error(await res.text().catch(() => `Failed (${res.status})`));
  }
  return res.json();
}
