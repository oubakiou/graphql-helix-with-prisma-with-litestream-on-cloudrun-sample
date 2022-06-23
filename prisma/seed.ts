import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.status.create({
    data: {
      body: 'just setting up my app',
      createdAt: new Date('2006/03/22 11:00:00'),
    },
  })

  await prisma.status.create({
    data: {
      body: 'inviting coworkers',
      createdAt: new Date('2014/03/22 12:00:00'),
    },
  })

  await prisma.status.create({
    data: { body: 'MySQL server has gone away...?' },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
