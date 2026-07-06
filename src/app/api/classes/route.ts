import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const classes = await prisma.classSession.findMany({
      include: {
        batch: { select: { name: true } },
        trainer: { select: { name: true, email: true } }
      },
      orderBy: { startTime: 'asc' }
    });
    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, batchId, trainerId, startTime, endTime } = body;

    if (!title || !batchId || !trainerId || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Mock Google Meet Integration
    // In a real application, we would call the Google Calendar API here, passing the startTime, endTime, and generating a conferenceData block.
    const meetLink = `https://meet.google.com/mock-${Math.random().toString(36).substring(2, 7)}-${Math.random().toString(36).substring(2, 7)}`;

    const classSession = await prisma.classSession.create({
      data: {
        title,
        batchId,
        trainerId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        meetLink,
      },
      include: {
        batch: { select: { name: true } },
        trainer: { select: { name: true, email: true } }
      }
    });

    return NextResponse.json(classSession, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to schedule class' }, { status: 500 });
  }
}
