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
    const { type, value, reason } = await req.json();

    if (!type || !value) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    // Verify trainer has access to batch
    const batch = await prisma.batch.findUnique({
      where: { id },
      include: { classes: { where: { trainerId: session.user.id } } }
    });

    if (!batch || batch.classes.length === 0) {
      return NextResponse.json({ message: 'Unauthorized or not found' }, { status: 403 });
    }

    const extensionRequest = await prisma.extensionRequest.create({
      data: {
        batchId: id,
        trainerId: session.user.id,
        type,
        value,
        reason: reason || null
      }
    });

    return NextResponse.json(extensionRequest, { status: 201 });
  } catch (error: any) {
    console.error("Extension request error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
