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

  // average grade
  const submissions = await prisma.assignmentSubmission.findMany({
    where: { userId, status: 'GRADED', grade: { not: null } }
  });
  const avgGrade = submissions.length > 0
    ? submissions.reduce((acc, sub) => acc + (sub.grade || 0), 0) / submissions.length
    : 0;

  // attendance %
  const attendanceRecords = await prisma.attendance.findMany({
    where: { userId }
  });
  const totalClasses = attendanceRecords.length;
  const presentClasses = attendanceRecords.filter(a => a.status === 'PRESENT').length;
  const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  const upcomingClasses = await prisma.classSession.findMany({
    where: {
      batch: {
        students: {
          some: { userId }
        }
      },
      startTime: {
        gte: today,
        lt: dayAfterTomorrow
      }
    },
    include: {
      batch: true,
      trainer: {
        select: { name: true }
      }
    },
    orderBy: { startTime: 'asc' }
  });

  const pendingAssignments = await prisma.assignment.findMany({
    where: {
      batch: {
        students: {
          some: { userId }
        }
      },
      submissions: {
        none: { userId }
      }
    },
    include: {
      batch: true
    },
    orderBy: { dueDate: 'asc' }
  });

  return NextResponse.json({
    stats: {
      averageGrade: avgGrade,
      attendancePercentage
    },
    upcomingClasses,
    pendingAssignments
  });
}
