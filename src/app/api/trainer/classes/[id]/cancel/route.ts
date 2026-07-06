import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'TRAINER') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const classSession = await prisma.classSession.findUnique({
      where: { id }
    });

    if (!classSession || classSession.trainerId !== session.user.id) {
      return NextResponse.json({ message: 'Not found or unauthorized' }, { status: 404 });
    }

    const updated = await prisma.classSession.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Cancel class error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
