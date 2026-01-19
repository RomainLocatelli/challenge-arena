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
// export async function fetchGames(): Promise<Game[]> {
//   try {
//     const res = await fetch(`${API_URL}games`);

//     if (!res.ok) {
//       throw new Error(`Failed to fetch games: ${res.status}`);
//     }

//     const data = await res.json();
//     return data.games;
//   } catch (error) {
//     console.error('Error fetching games:', error);
//     throw error;
//   }
// }

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
