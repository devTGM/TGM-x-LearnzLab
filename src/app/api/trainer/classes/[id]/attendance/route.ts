import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'TRAINER') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  
  // Verify the class belongs to this trainer
  const classSession = await prisma.classSession.findUnique({
    where: { id },
    include: { batch: true }
  });

  if (!classSession || classSession.trainerId !== session.user.id) {
    return NextResponse.json({ message: 'Not found or unauthorized' }, { status: 404 });
  }

  // Get all students in the batch
  const batchStudents = await prisma.batchStudent.findMany({
    where: { batchId: classSession.batchId },
    include: { user: { select: { id: true, name: true, email: true } } }
  });

  // Get existing attendance for this class
  const attendanceRecords = await prisma.attendance.findMany({
    where: { classSessionId: id }
  });

  // Combine data: { student, status }
  const studentsWithAttendance = batchStudents.map(bs => {
    const record = attendanceRecords.find(a => a.userId === bs.userId);
    return {
      user: bs.user,
      status: record ? record.status : 'ABSENT', // Default to ABSENT if no record exists
    };
  });

  return NextResponse.json({
    classSession,
    attendance: studentsWithAttendance
  });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'TRAINER') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const { attendanceData } = await req.json(); // Array of { userId, status }

  if (!Array.isArray(attendanceData)) {
    return NextResponse.json({ message: 'Invalid data format' }, { status: 400 });
  }

  // Verify class belongs to trainer
  const classSession = await prisma.classSession.findUnique({ where: { id } });
  if (!classSession || classSession.trainerId !== session.user.id) {
    return NextResponse.json({ message: 'Not found or unauthorized' }, { status: 404 });
  }

  // Upsert attendance for all students in the array
  await prisma.$transaction(
    attendanceData.map((data: { userId: string, status: string }) => 
      prisma.attendance.upsert({
        where: { classSessionId_userId: { classSessionId: id, userId: data.userId } },
        update: { status: data.status },
        create: { classSessionId: id, userId: data.userId, status: data.status }
      })
    )
  );

  // Update class status to COMPLETED if attendance is taken
  if (classSession.status !== 'COMPLETED') {
    await prisma.classSession.update({
      where: { id },
      data: { status: 'COMPLETED' }
    });
  }

  return NextResponse.json({ message: 'Attendance saved successfully' });
}
