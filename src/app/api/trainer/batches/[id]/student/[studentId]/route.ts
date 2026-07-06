import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string, studentId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'TRAINER') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const { id: batchId, studentId } = await params;

    // Check if trainer has access to this batch
    const hasAccess = await prisma.classSession.findFirst({
      where: { batchId, trainerId: session.user.id }
    });

    if (!hasAccess) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { id: true, name: true, email: true, phone: true }
    });

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    // Get all assignments for this batch with the student's submissions
    const assignments = await prisma.assignment.findMany({
      where: { batchId },
      include: {
        submissions: {
          where: { userId: studentId }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get attendance
    const attendanceRecords = await prisma.attendance.findMany({
      where: { 
        userId: studentId,
        classSession: { batchId }
      },
      include: {
        classSession: { select: { title: true, startTime: true } }
      },
      orderBy: { classSession: { startTime: 'desc' } }
    });

    const totalClasses = await prisma.classSession.count({ where: { batchId } });
    const attended = attendanceRecords.filter(r => r.status === 'PRESENT').length;
    const attendancePercentage = totalClasses === 0 ? 0 : Math.round((attended / totalClasses) * 100);

    return NextResponse.json({
      student,
      assignments,
      attendance: {
        records: attendanceRecords,
        total: totalClasses,
        attended,
        percentage: attendancePercentage
      }
    });

  } catch (error: any) {
    console.error("Student report API Error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
