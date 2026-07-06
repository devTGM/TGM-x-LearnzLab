import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'TRAINER') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const { id } = await params;

    const hasAccess = await prisma.classSession.findFirst({
      where: { batchId: id, trainerId: session.user.id }
    });

    if (!hasAccess) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Get all students in batch
    const batchStudents = await prisma.batchStudent.findMany({
      where: { batchId: id },
      include: { user: { select: { id: true, name: true, email: true } } }
    });

    // Get all classes for this batch to calculate attendance %
    const classSessions = await prisma.classSession.findMany({
      where: { batchId: id, status: 'COMPLETED' },
      select: { id: true }
    });
    const totalClasses = classSessions.length;
    const classIds = classSessions.map(c => c.id);

    const attendanceRecords = await prisma.attendance.findMany({
      where: { classSessionId: { in: classIds } }
    });

    // Get all assignments for this batch
    const assignments = await prisma.assignment.findMany({
      where: { batchId: id },
      select: { id: true }
    });
    const assignmentIds = assignments.map(a => a.id);

    const submissions = await prisma.assignmentSubmission.findMany({
      where: { assignmentId: { in: assignmentIds } }
    });

    // Compile report card
    const reportCard = batchStudents.map(bs => {
      // Attendance calc
      const studentAttendance = attendanceRecords.filter(a => a.userId === bs.userId);
      const presentCount = studentAttendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
      const attendancePercentage = totalClasses === 0 ? 0 : Math.round((presentCount / totalClasses) * 100);

      // Assignment calc
      const studentSubmissions = submissions.filter(s => s.userId === bs.userId && s.grade !== null);
      const totalGrades = studentSubmissions.reduce((sum, sub) => sum + (sub.grade || 0), 0);
      const averageGrade = studentSubmissions.length === 0 ? null : Math.round(totalGrades / studentSubmissions.length);

      return {
        user: bs.user,
        attendance: {
          total: totalClasses,
          attended: presentCount,
          percentage: attendancePercentage
        },
        assignments: {
          submitted: submissions.filter(s => s.userId === bs.userId).length,
          total: assignments.length,
          averageGrade
        }
      };
    });

    return NextResponse.json(reportCard);
  } catch (error: any) {
    console.error("Report Card API Error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
