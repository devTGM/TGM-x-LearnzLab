import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'TRAINER') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  // Get distinct batches the trainer has classes for
  const classSessions = await prisma.classSession.findMany({
    where: { trainerId: session.user.id },
    select: { batchId: true },
    distinct: ['batchId']
  });

  const batchIds = classSessions.map(c => c.batchId);

  const batches = await prisma.batch.findMany({
    where: { id: { in: batchIds } },
    include: {
      course: { select: { title: true } },
      _count: { select: { students: true, classes: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(batches);
}
