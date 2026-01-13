import { prisma } from './lib/prisma.js'

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashedpass123',
    },
  })
  console.log('User créé:', user)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
  })
