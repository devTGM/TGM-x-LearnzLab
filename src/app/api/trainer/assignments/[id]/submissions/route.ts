import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'TRAINER') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const { id } = await params;

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        submissions: {
          include: { user: { select: { id: true, name: true, email: true } } }
        }
      }
    });

    if (!assignment) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    // Ensure trainer has access to this batch
    const hasAccess = await prisma.classSession.findFirst({
      where: { batchId: assignment.batchId, trainerId: session.user.id }
    });

    if (!hasAccess) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json(assignment);
  } catch (error: any) {
    console.error("Submissions API GET Error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
