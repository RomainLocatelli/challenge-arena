import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

// Méthodes qui modifient des données : ce sont elles qu'une attaque CSRF vise
const UNSAFE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

// Renvoie l'origine de la requête (ex : "https://challengearena.fr"), ou null si absente
function getRequestOrigin(req: Request): string | null {
  const origin = req.get('origin');
  if (origin) {
    return origin;
  }

  // Repli : certains navigateurs n'envoient que le Referer
  const referer = req.get('referer');
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      return null;
    }
  }

  return null;
}

// Middleware : bloque les requêtes qui modifient des données
// si elles viennent d'un autre site que notre front-end
export function csrfProtection(allowedOrigin: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    // 1. Les méthodes sûres (GET, HEAD, OPTIONS) passent toujours
    if (!UNSAFE_METHODS.includes(req.method)) {
      return next();
    }

    const origin = getRequestOrigin(req);

    // 2. Pas d'origine = pas un navigateur (curl, Postman, tests) : pas de risque CSRF
    if (!origin) {
      return next();
    }

    // 3. Origine différente de notre front-end : on bloque
    if (origin !== allowedOrigin) {
      return next(new AppError('Origine de la requête non autorisée', 403));
    }

    return next();
  };
}
