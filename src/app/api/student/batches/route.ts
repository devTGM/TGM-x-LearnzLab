import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'STUDENT') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const batches = await prisma.batch.findMany({
    where: {
      students: {
        some: { userId: session.user.id }
      }
    },
    include: {
      course: true,
      students: true,
      _count: {
        select: { classes: true, assignments: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(batches);
}
