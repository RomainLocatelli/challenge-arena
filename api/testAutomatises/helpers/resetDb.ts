import { prisma } from '../../lib/prisma.js';

// Vide toutes les tables, dans l'ordre qui respecte les contraintes de clé étrangère
// (on supprime d'abord ce qui dépend d'autre chose, avant les tables "racines")
export async function resetDb() {
  await prisma.participationVote.deleteMany(); // dépend de User + Participation
  await prisma.challengeVote.deleteMany();      // dépend de User + Challenge
  await prisma.report.deleteMany();             // dépend de User
  await prisma.participation.deleteMany();      // dépend de User + Challenge
  await prisma.challenge.deleteMany();          // dépend de User (creator) + Game
  await prisma.game.deleteMany();               // aucune dépendance
  await prisma.user.deleteMany();               // table racine
}