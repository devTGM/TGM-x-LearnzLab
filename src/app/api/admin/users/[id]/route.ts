import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const { name, phone, role, isActive, password } = await req.json();

  const data: any = { name, phone, role, isActive };
  if (password && password.length >= 6) {
    data.password = await bcrypt.hash(password, 10);
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, phone: true, role: true, isActive: true, createdAt: true },
  });

  return NextResponse.json(user);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  // Prevent deleting yourself
  if (session.user.id === id) {
    return NextResponse.json({ message: 'Cannot delete your own account' }, { status: 400 });
  }

  await prisma.user.delete({
    where: { id },
  });

  return NextResponse.json({ message: 'User deleted' });
}
