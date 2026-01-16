import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import argon2 from 'argon2';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  // Nettoyer la base
  await prisma.participationVote.deleteMany();
  await prisma.challengeVote.deleteMany();
  await prisma.participation.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Database cleaned');

  // Créer des users
  const hashedPassword = await argon2.hash('Test1234!');

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alice@example.com',
        username: 'alice',
        password: hashedPassword,
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'bob@example.com',
        username: 'bob',
        password: hashedPassword,
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'charlie@example.com',
        username: 'charlie',
        password: hashedPassword,
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'admin@example.com',
        username: 'admin',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Créer des games
  const games = await Promise.all([
    prisma.game.create({
      data: {
        id: '326243',
        slug: 'elden-ring',
        title: 'Elden Ring',
        imageUrl: 'https://media.rawg.io/media/games/5ec/5ecac5cb026ec26a56efcc546364e348.jpg',
        description: 'An action RPG set in a dark fantasy world'
      }
    }),
    prisma.game.create({
      data: {
        id: '3328',
        slug: 'the-witcher-3-wild-hunt',
        title: 'The Witcher 3',
        imageUrl: 'https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg',
        description: 'A story-driven open world RPG'
      }
    }),
    prisma.game.create({
      data: {
        id: '622492',
        slug: 'god-of-war',
        title: 'God of War',
        imageUrl: 'https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg',
        description: 'An action-adventure game based on Norse mythology'
      }
    })
  ]);

  console.log(`✅ Created ${games.length} games`);

  // Créer des challenges
  const challenges = await Promise.all([
    prisma.challenge.create({
      data: {
        title: 'Speedrun Any%',
        scoreFormat: 'time',
        description: 'Complete the game as fast as possible',
        gameId: games[0].id,
        createdBy: users[0].id
      }
    }),
    prisma.challenge.create({
      data: {
        title: 'No Hit Challenge',
        scoreFormat: 'boolean',
        description: 'Complete without taking damage',
        gameId: games[0].id,
        createdBy: users[1].id
      }
    }),
    prisma.challenge.create({
      data: {
        title: 'Death March Difficulty',
        scoreFormat: 'score',
        description: 'Complete on hardest difficulty',
        gameId: games[1].id,
        createdBy: users[0].id
      }
    }),
    prisma.challenge.create({
      data: {
        title: 'All Achievements',
        scoreFormat: 'score',
        description: 'Unlock all achievements',
        gameId: games[1].id,
        createdBy: users[2].id
      }
    }),
    prisma.challenge.create({
      data: {
        title: 'God Mode',
        scoreFormat: 'time',
        description: 'Complete on God difficulty',
        gameId: games[2].id,
        createdBy: users[1].id
      }
    })
  ]);

  console.log(`✅ Created ${challenges.length} challenges`);

  // Créer des participations
  const participations = await Promise.all([
    // Challenge 1 : 4 participations
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=123',
        description: 'My first speedrun attempt',
        userId: users[0].id,
        challengeId: challenges[0].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=456',
        description: 'Better time!',
        userId: users[1].id,
        challengeId: challenges[0].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=789',
        description: 'Casual run',
        userId: users[2].id,
        challengeId: challenges[0].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=101',
        description: 'World record attempt',
        userId: users[3].id,
        challengeId: challenges[0].id
      }
    }),
    // Challenge 2 : 2 participations
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=202',
        description: 'Did it!',
        userId: users[0].id,
        challengeId: challenges[1].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=303',
        description: 'Flawless victory',
        userId: users[2].id,
        challengeId: challenges[1].id
      }
    }),
    // Challenge 3 : 3 participations
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=404',
        description: 'Almost perfect score',
        userId: users[1].id,
        challengeId: challenges[2].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=505',
        description: 'Good run',
        userId: users[2].id,
        challengeId: challenges[2].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=606',
        description: 'Solid attempt',
        userId: users[3].id,
        challengeId: challenges[2].id
      }
    })
  ]);

  console.log(`✅ Created ${participations.length} participations`);

  // Créer des votes sur challenges
  await Promise.all([
    prisma.challengeVote.create({
      data: { userId: users[1].id, challengeId: challenges[0].id }
    }),
    prisma.challengeVote.create({
      data: { userId: users[2].id, challengeId: challenges[0].id }
    }),
    prisma.challengeVote.create({
      data: { userId: users[3].id, challengeId: challenges[0].id }
    }),
    prisma.challengeVote.create({
      data: { userId: users[0].id, challengeId: challenges[1].id }
    }),
    prisma.challengeVote.create({
      data: { userId: users[2].id, challengeId: challenges[2].id }
    })
  ]);

  console.log('✅ Created challenge votes');

  // Créer des votes sur participations
  await Promise.all([
    // Participation 1 : 3 votes
    prisma.participationVote.create({
      data: { userId: users[1].id, participationId: participations[0].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[2].id, participationId: participations[0].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[3].id, participationId: participations[0].id }
    }),
    // Participation 2 : 5 votes
    prisma.participationVote.create({
      data: { userId: users[0].id, participationId: participations[1].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[2].id, participationId: participations[1].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[3].id, participationId: participations[1].id }
    }),
    // Participation 3 : 2 votes
    prisma.participationVote.create({
      data: { userId: users[0].id, participationId: participations[2].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[1].id, participationId: participations[2].id }
    }),
    // Participation 7 : 4 votes
    prisma.participationVote.create({
      data: { userId: users[0].id, participationId: participations[6].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[1].id, participationId: participations[6].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[2].id, participationId: participations[6].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[3].id, participationId: participations[6].id }
    })
  ]);

  console.log('✅ Created participation votes');

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
