import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'STUDENT') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const classes = await prisma.classSession.findMany({
    where: {
      batch: {
        students: {
          some: { userId: session.user.id }
        }
      }
    },
    include: {
      batch: { select: { name: true } },
      trainer: { select: { name: true } },
      attendance: {
        where: { userId: session.user.id }
      }
    },
    orderBy: { startTime: 'desc' }
  });

  return NextResponse.json(classes);
}
