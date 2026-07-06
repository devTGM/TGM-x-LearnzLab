import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'STUDENT') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = params;
  
  try {
    const { content } = await req.json();

    if (!content) {
      return new NextResponse('Content is required', { status: 400 });
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        batch: {
          include: {
            students: {
              where: { userId: session.user.id }
            }
          }
        }
      }
    });

    if (!assignment) {
      return new NextResponse('Assignment not found', { status: 404 });
    }

    if (assignment.batch.students.length === 0) {
      return new NextResponse('User is not enrolled in the batch for this assignment', { status: 403 });
    }

    const submission = await prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_userId: {
          assignmentId: id,
          userId: session.user.id
        }
      },
      update: {
        content,
        status: 'PENDING',
        submittedAt: new Date()
      },
      create: {
        assignmentId: id,
        userId: session.user.id,
        content,
        status: 'PENDING'
      }
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Submission error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
