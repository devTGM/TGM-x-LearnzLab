import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const batchId = 'cm5l9w8u00003yqwq0e4b8s5y'; // Assuming a test batch ID
  
  const assignments = await prisma.assignment.findMany({
    where: { batchId: batchId },
    include: {
      _count: { select: { submissions: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  console.log("Assignments:", assignments);
}

main().catch(console.error).finally(() => prisma.$disconnect());
