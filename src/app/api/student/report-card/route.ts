import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'STUDENT') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const userId = session.user.id;

  const attendance = await prisma.attendance.findMany({
    where: { userId },
    include: {
      classSession: {
        select: {
          title: true,
          startTime: true,
          batch: { select: { name: true } }
        }
      }
    },
    orderBy: { markedAt: 'desc' }
  });

  const gradedAssignments = await prisma.assignmentSubmission.findMany({
    where: { userId, status: 'GRADED' },
    include: {
      assignment: {
        select: {
          title: true,
          batch: { select: { name: true } }
        }
      }
    },
    orderBy: { submittedAt: 'desc' }
  });

  return NextResponse.json({
    attendance,
    gradedAssignments
  });
}
