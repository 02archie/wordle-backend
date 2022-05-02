import { PrismaClient, Prisma } from '@prisma/client';
import { users } from './data/user';
import { words } from './data/words';

const prisma = new PrismaClient();

const wordsData: Prisma.wordsCreateInput[] = words;
const usersData: Prisma.usersCreateInput[] = users;

async function main() {
  console.log(`Start seeding ...`);
  for (const u of wordsData) {
    const word = await prisma.words.create({
      data: u,
    });
    console.log(`Created word with id: ${word.id}`);
  }
  for (const u of usersData) {
    const user = await prisma.users.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
