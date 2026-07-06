import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'STUDENT') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const assignments = await prisma.assignment.findMany({
    where: {
      batch: {
        students: {
          some: { userId: session.user.id }
        }
      }
    },
    include: {
      batch: { select: { name: true } },
      submissions: {
        where: { userId: session.user.id }
      }
    },
    orderBy: { dueDate: 'desc' }
  });

  return NextResponse.json(assignments);
}
