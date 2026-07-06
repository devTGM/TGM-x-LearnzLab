import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'TRAINER') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const { id } = await params;

    // Ensure trainer has access to this batch
    const hasAccess = await prisma.classSession.findFirst({
      where: { batchId: id, trainerId: session.user.id }
    });

    if (!hasAccess) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const assignments = await prisma.assignment.findMany({
      where: { batchId: id },
      include: {
        _count: { select: { submissions: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(assignments);
  } catch (error: any) {
    console.error("Assignments API GET Error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const { title, description, dueDate, fileUrl } = await req.json();

    if (!title || !description || !dueDate) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        fileUrl: fileUrl || null,
        batchId: id,
        authorId: session.user.id
      }
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error: any) {
    console.error("Assignments API POST Error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
