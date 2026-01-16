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

  // Créer 10 users
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
        email: 'diana@example.com',
        username: 'diana',
        password: hashedPassword,
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'eve@example.com',
        username: 'eve',
        password: hashedPassword,
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'frank@example.com',
        username: 'frank',
        password: hashedPassword,
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'grace@example.com',
        username: 'grace',
        password: hashedPassword,
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'henry@example.com',
        username: 'henry',
        password: hashedPassword,
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'iris@example.com',
        username: 'iris',
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
        imageUrl: 'https://media.rawg.io/media/games/5ec/5ecac5cb026ec26a56efcc546364e348.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '3328',
        slug: 'the-witcher-3-wild-hunt',
        title: 'The Witcher 3',
        imageUrl: 'https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '12447',
        slug: 'dark-souls',
        title: 'Dark Souls',
        imageUrl: 'https://media.rawg.io/media/games/559/559bc0768f656ad0c63c54b80a82d680.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '58175',
        slug: 'god-of-war-2018',
        title: 'God of War (2018)',
        imageUrl: 'https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg'
      }
    }),
    prisma.game.create({
      data: {
        id: '22509',
        slug: 'minecraft',
        title: 'Minecraft',
        imageUrl: 'https://media.rawg.io/media/games/b4e/b4e4c73d5aa4ec66bbf75375c4847a2b.jpg'
      }
    })
  ]);

  console.log(`✅ Created ${games.length} games`);

  // Créer 8 challenges
  const challenges = await Promise.all([
    prisma.challenge.create({
      data: {
        title: 'Speedrun Any%',
        slug: 'speedrun-any-percent',
        scoreFormat: 'time',
        description: 'Complete the game as fast as possible',
        gameId: games[0].id,
        createdBy: users[0].id
      }
    }),
    prisma.challenge.create({
      data: {
        title: 'No Hit Challenge',
        slug: 'no-hit-challenge',
        scoreFormat: 'boolean',
        description: 'Complete without taking damage',
        gameId: games[0].id,
        createdBy: users[1].id
      }
    }),
    prisma.challenge.create({
      data: {
        title: 'Death March Difficulty',
        slug: 'death-march-difficulty',
        scoreFormat: 'score',
        description: 'Complete on hardest difficulty',
        gameId: games[1].id,
        createdBy: users[2].id
      }
    }),
    prisma.challenge.create({
      data: {
        title: 'All Achievements',
        slug: 'all-achievements',
        scoreFormat: 'score',
        description: 'Unlock all achievements',
        gameId: games[1].id,
        createdBy: users[3].id
      }
    }),
    prisma.challenge.create({
      data: {
        title: 'SL1 Run',
        slug: 'sl1-run',
        scoreFormat: 'boolean',
        description: 'Complete Dark Souls at Soul Level 1',
        gameId: games[2].id,
        createdBy: users[4].id
      }
    }),
    prisma.challenge.create({
      data: {
        title: 'God Mode Difficulty',
        slug: 'god-mode-difficulty',
        scoreFormat: 'time',
        description: 'Complete on God difficulty',
        gameId: games[3].id,
        createdBy: users[5].id
      }
    }),
    prisma.challenge.create({
      data: {
        title: 'Hardcore Survival',
        slug: 'hardcore-survival',
        scoreFormat: 'score',
        description: 'Survive 100 days in Hardcore mode',
        gameId: games[4].id,
        createdBy: users[6].id
      }
    }),
    prisma.challenge.create({
      data: {
        title: 'Boss Rush No Damage',
        slug: 'boss-rush-no-damage',
        scoreFormat: 'boolean',
        description: 'Defeat all bosses without taking damage',
        gameId: games[2].id,
        createdBy: users[7].id
      }
    })
  ]);

  console.log(`✅ Created ${challenges.length} challenges`);

  // Créer 25 participations (pour avoir de la variété)
  const participations = await Promise.all([
    // Challenge 0 : 5 participations
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=1',
        description: 'My first speedrun',
        userId: users[0].id,
        challengeId: challenges[0].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=2',
        description: 'Better time!',
        userId: users[1].id,
        challengeId: challenges[0].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=3',
        description: 'Personal best',
        userId: users[2].id,
        challengeId: challenges[0].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=4',
        description: 'World record attempt',
        userId: users[3].id,
        challengeId: challenges[0].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=5',
        description: 'Casual run',
        userId: users[4].id,
        challengeId: challenges[0].id
      }
    }),
    // Challenge 1 : 3 participations
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=6',
        description: 'Did it!',
        userId: users[0].id,
        challengeId: challenges[1].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=7',
        description: 'Flawless victory',
        userId: users[5].id,
        challengeId: challenges[1].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=8',
        description: 'After 50 attempts',
        userId: users[6].id,
        challengeId: challenges[1].id
      }
    }),
    // Challenge 2 : 4 participations
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=9',
        description: 'Perfect score',
        userId: users[1].id,
        challengeId: challenges[2].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=10',
        description: 'Good run',
        userId: users[7].id,
        challengeId: challenges[2].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=11',
        description: 'Solid attempt',
        userId: users[8].id,
        challengeId: challenges[2].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=12',
        description: 'Nearly there',
        userId: users[0].id,
        challengeId: challenges[2].id
      }
    }),
    // Challenge 3 : 3 participations
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=13',
        description: '100% completion',
        userId: users[2].id,
        challengeId: challenges[3].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=14',
        description: 'All achievements unlocked',
        userId: users[3].id,
        challengeId: challenges[3].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=15',
        description: 'Grinding complete',
        userId: users[4].id,
        challengeId: challenges[3].id
      }
    }),
    // Challenge 4 : 2 participations
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=16',
        description: 'SL1 complete!',
        userId: users[5].id,
        challengeId: challenges[4].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=17',
        description: 'Hardest challenge ever',
        userId: users[0].id,
        challengeId: challenges[4].id
      }
    }),
    // Challenge 5 : 3 participations
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=18',
        description: 'God mode beaten',
        userId: users[6].id,
        challengeId: challenges[5].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=19',
        description: 'Finally done',
        userId: users[7].id,
        challengeId: challenges[5].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=20',
        description: 'Epic run',
        userId: users[1].id,
        challengeId: challenges[5].id
      }
    }),
    // Challenge 6 : 3 participations
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=21',
        description: '100 days survived',
        userId: users[8].id,
        challengeId: challenges[6].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=22',
        description: 'Made it to day 150',
        userId: users[2].id,
        challengeId: challenges[6].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=23',
        description: 'Hardcore legend',
        userId: users[0].id,
        challengeId: challenges[6].id
      }
    }),
    // Challenge 7 : 2 participations
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=24',
        description: 'All bosses no damage',
        userId: users[3].id,
        challengeId: challenges[7].id
      }
    }),
    prisma.participation.create({
      data: {
        submissionUrl: 'https://youtube.com/watch?v=25',
        description: 'Insane run',
        userId: users[0].id,
        challengeId: challenges[7].id
      }
    })
  ]);

  console.log(`✅ Created ${participations.length} participations`);

  // Créer des votes sur participations (pour le leaderboard "topByLikes")
  // On va créer beaucoup de votes pour différencier les users
  await Promise.all([
    // Alice (users[0]) a beaucoup de likes (elle a 5 participations)
    prisma.participationVote.create({
      data: { userId: users[1].id, participationId: participations[0].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[2].id, participationId: participations[0].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[3].id, participationId: participations[0].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[4].id, participationId: participations[5].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[5].id, participationId: participations[5].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[6].id, participationId: participations[11].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[7].id, participationId: participations[11].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[8].id, participationId: participations[16].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[1].id, participationId: participations[22].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[2].id, participationId: participations[24].id }
    }),

    // Bob (users[1]) a des likes
    prisma.participationVote.create({
      data: { userId: users[0].id, participationId: participations[1].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[3].id, participationId: participations[1].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[4].id, participationId: participations[8].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[5].id, participationId: participations[18].id }
    }),

    // Charlie (users[2])
    prisma.participationVote.create({
      data: { userId: users[1].id, participationId: participations[2].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[4].id, participationId: participations[12].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[5].id, participationId: participations[21].id }
    }),

    // Diana (users[3])
    prisma.participationVote.create({
      data: { userId: users[0].id, participationId: participations[3].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[1].id, participationId: participations[13].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[2].id, participationId: participations[23].id }
    }),

    // Eve (users[4])
    prisma.participationVote.create({
      data: { userId: users[0].id, participationId: participations[4].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[1].id, participationId: participations[14].id }
    }),

    // Frank (users[5])
    prisma.participationVote.create({
      data: { userId: users[0].id, participationId: participations[6].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[1].id, participationId: participations[15].id }
    }),

    // Grace (users[6])
    prisma.participationVote.create({
      data: { userId: users[0].id, participationId: participations[7].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[1].id, participationId: participations[17].id }
    }),

    // Henry (users[7])
    prisma.participationVote.create({
      data: { userId: users[0].id, participationId: participations[9].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[2].id, participationId: participations[19].id }
    }),

    // Iris (users[8])
    prisma.participationVote.create({
      data: { userId: users[0].id, participationId: participations[10].id }
    }),
    prisma.participationVote.create({
      data: { userId: users[1].id, participationId: participations[20].id }
    })
  ]);

  console.log('✅ Created participation votes');

  // Créer des votes sur challenges
  await Promise.all([
    prisma.challengeVote.create({
      data: { userId: users[1].id, challengeId: challenges[0].id }
    }),
    prisma.challengeVote.create({
      data: { userId: users[2].id, challengeId: challenges[0].id }
    }),
    prisma.challengeVote.create({
      data: { userId: users[3].id, challengeId: challenges[1].id }
    }),
    prisma.challengeVote.create({
      data: { userId: users[4].id, challengeId: challenges[2].id }
    }),
    prisma.challengeVote.create({
      data: { userId: users[5].id, challengeId: challenges[3].id }
    })
  ]);

  console.log('✅ Created challenge votes');

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