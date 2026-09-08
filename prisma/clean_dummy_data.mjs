import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning all research paper dummy data...');

  const deletedReviews = await prisma.review.deleteMany();
  const deletedRevisions = await prisma.revisionHistory.deleteMany();
  const deletedSubmissions = await prisma.submission.deleteMany();

  console.log(`Successfully deleted:
- ${deletedReviews.count} reviews
- ${deletedRevisions.count} revision history records
- ${deletedSubmissions.count} submissions`);

  const remaining = await prisma.submission.count();
  console.log(`Current submissions count in database: ${remaining}`);
}

main()
  .catch((e) => {
    console.error('Error cleaning dummy data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
