import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const batches = await prisma.batch.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { students: true } } },
  });
  return NextResponse.json(batches);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const { name, startDate, endDate, time } = await req.json();
  if (!name) return NextResponse.json({ message: 'Batch name is required' }, { status: 400 });

  const batch = await prisma.batch.create({
    data: {
      name,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      time,
    },
  });
  return NextResponse.json(batch, { status: 201 });
}
