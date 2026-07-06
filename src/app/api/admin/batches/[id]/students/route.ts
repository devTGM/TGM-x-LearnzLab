import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const batchStudents = await prisma.batchStudent.findMany({
    where: { batchId: id },
    include: { user: { select: { id: true, name: true, email: true, role: true } } }
  });

  return NextResponse.json(batchStudents.map(bs => bs.user));
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const { userIds } = await req.json();
  if (!Array.isArray(userIds)) return NextResponse.json({ message: 'userIds array is required' }, { status: 400 });

  // Add the students to the batch
  await prisma.$transaction(
    userIds.map((userId: string) => 
      prisma.batchStudent.upsert({
        where: { batchId_userId: { batchId: id, userId } },
        update: {},
        create: { batchId: id, userId },
      })
    )
  );

  return NextResponse.json({ message: 'Students added successfully' });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ message: 'userId is required' }, { status: 400 });

  await prisma.batchStudent.delete({
    where: { batchId_userId: { batchId: id, userId } }
  });

  return NextResponse.json({ message: 'Student removed successfully' });
}
