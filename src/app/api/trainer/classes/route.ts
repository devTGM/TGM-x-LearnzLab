import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'TRAINER') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const classes = await prisma.classSession.findMany({
    where: { trainerId: session.user.id },
    include: {
      batch: { select: { id: true, name: true, _count: { select: { students: true } } } }
    },
    orderBy: { startTime: 'desc' }
  });

  return NextResponse.json(classes);
}
