import { PrismaClient, Prisma } from '@prisma/client';
import { words } from './data/words';

const prisma = new PrismaClient();

const wordsData: Prisma.wordsCreateInput[] = words;

async function main() {
  console.log(`Start seeding ...`);
  for (const u of wordsData) {
    const word = await prisma.words.create({
      data: u,
    });
    console.log(`Created user with id: ${word.id}`);
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
