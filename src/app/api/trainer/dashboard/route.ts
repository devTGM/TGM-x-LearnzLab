import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'TRAINER') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const trainerId = session.user.id;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  // Fetch all classes for the trainer
  const allClasses = await prisma.classSession.findMany({
    where: { trainerId },
    include: {
      batch: { select: { id: true, name: true, _count: { select: { students: true } } } }
    },
    orderBy: { startTime: 'asc' }
  });

  const totalClasses = allClasses.length;
  const completedClasses = allClasses.filter(c => c.status === 'COMPLETED').length;
  const upcomingClasses = allClasses.filter(c => c.status !== 'COMPLETED' && new Date(c.startTime) > now).length;
  
  // Calculate unique students across all batches the trainer teaches
  const batchIds = Array.from(new Set(allClasses.map(c => c.batchId)));
  const uniqueStudentsQuery = await prisma.batchStudent.findMany({
    where: { batchId: { in: batchIds } },
    distinct: ['userId'],
  });
  const totalStudents = uniqueStudentsQuery.length;

  const todaysClasses = allClasses.filter(c => {
    const classTime = new Date(c.startTime);
    return classTime >= startOfToday && classTime <= endOfToday;
  });

  return NextResponse.json({
    stats: {
      totalClasses,
      completedClasses,
      upcomingClasses,
      totalStudents
    },
    todaysClasses
  });
}
