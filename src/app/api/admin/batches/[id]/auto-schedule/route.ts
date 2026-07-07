import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const { daysOfWeek, startTime, durationHours, trainerId, meetLink } = await req.json();

  if (!daysOfWeek || !Array.isArray(daysOfWeek) || daysOfWeek.length === 0) {
    return NextResponse.json({ message: 'Select at least one day of the week' }, { status: 400 });
  }
  if (!startTime || !durationHours || !trainerId) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const batch = await prisma.batch.findUnique({ where: { id } });
  if (!batch) return NextResponse.json({ message: 'Batch not found' }, { status: 404 });
  if (!batch.startDate || !batch.endDate) {
    return NextResponse.json({ message: 'Batch must have a start date and end date to auto-schedule' }, { status: 400 });
  }

  const [hours, minutes] = startTime.split(':').map(Number);
  const durationMs = parseFloat(durationHours) * 60 * 60 * 1000;

  let current = new Date(batch.startDate);
  current.setUTCHours(0, 0, 0, 0); // strictly use UTC to prevent Vercel timezone mismatch

  const end = new Date(batch.endDate);
  end.setUTCHours(23, 59, 59, 999);

  let classCount = 1;
  const sessionsToCreate = [];

  while (current <= end) {
    if (daysOfWeek.includes(current.getUTCDay())) {
      const sessionStart = new Date(current);
      
      // Treat the input 'startTime' as IST (UTC +5:30)
      // To store the correct absolute time in the DB, subtract 5 hours and 30 minutes
      sessionStart.setUTCHours(hours - 5, minutes - 30, 0, 0);
      
      const sessionEnd = new Date(sessionStart.getTime() + durationMs);

      sessionsToCreate.push({
        title: `${batch.name} - Class ${classCount}`,
        startTime: sessionStart,
        endTime: sessionEnd,
        meetLink: meetLink || null,
        batchId: id,
        trainerId,
      });

      classCount++;
    }
    // Increment day by 1 in UTC
    current.setUTCDate(current.getUTCDate() + 1);
  }

  if (sessionsToCreate.length === 0) {
    return NextResponse.json({ message: 'No classes could be scheduled in the given date range for the selected days' }, { status: 400 });
  }

  await prisma.classSession.createMany({
    data: sessionsToCreate,
  });

  return NextResponse.json({ message: `Successfully scheduled ${sessionsToCreate.length} classes` });
}
