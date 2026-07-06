import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const classes = await prisma.classSession.findMany({
    orderBy: { startTime: 'desc' },
    include: {
      batch: { select: { id: true, name: true } },
      trainer: { select: { id: true, name: true } },
    }
  });
  return NextResponse.json(classes);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const { title, startTime, endTime, meetLink, batchId, trainerId } = await req.json();
  
  if (!title || !startTime || !endTime || !batchId || !trainerId) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const newClass = await prisma.classSession.create({
    data: {
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      meetLink,
      batchId,
      trainerId,
    },
    include: {
      batch: { select: { id: true, name: true } },
      trainer: { select: { id: true, name: true } },
    }
  });

  return NextResponse.json(newClass, { status: 201 });
}
