import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const { name, startDate, endDate, time } = await req.json();
  if (!name) return NextResponse.json({ message: 'Batch name is required' }, { status: 400 });

  const batch = await prisma.batch.update({
    where: { id },
    data: {
      name,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      time,
    },
  });
  return NextResponse.json(batch);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  await prisma.batch.delete({ where: { id } });
  return NextResponse.json({ message: 'Batch deleted' });
}
