import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'TRAINER') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    
    // Make sure trainer owns the class
    const classSession = await prisma.classSession.findUnique({ where: { id } });
    if (!classSession || classSession.trainerId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const updateData: any = {};
    if (body.meetLink !== undefined) updateData.meetLink = body.meetLink;
    if (body.recordingUrl !== undefined) updateData.recordingUrl = body.recordingUrl;

    const updated = await prisma.classSession.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[CLASS_UPDATE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
