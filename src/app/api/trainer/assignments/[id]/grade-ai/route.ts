import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'TRAINER') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const { id } = await params;

  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: { submissions: true }
  });

  if (!assignment) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const hasAccess = await prisma.classSession.findFirst({
    where: { batchId: assignment.batchId, trainerId: session.user.id }
  });

  if (!hasAccess) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  // Find all pending submissions
  const pendingSubmissions = assignment.submissions.filter(s => s.status === 'PENDING');

  // Perform AI Grading for each pending submission
  const updates = pendingSubmissions.map(async (sub) => {
    let grade = 0;
    let feedback = '';

    try {
      const prompt = `You are an expert AI teaching assistant grading a student's submission.
Assignment Title: ${assignment.title}
Assignment Description: ${assignment.description}
Student Submission Content: ${sub.content}

Evaluate the student's submission based on the assignment description. Provide a JSON response in the exact format below, with nothing else (no markdown blocks, no extra text):
{
  "grade": number,
  "feedback": "string explaining the grade and constructive feedback"
}
Ensure the grade is a number out of 100.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text?.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(responseText || '{}');
      grade = parsed.grade || 0;
      feedback = parsed.feedback || "Unable to generate feedback.";
    } catch (e: any) {
      console.error('AI Grading failed for submission:', sub.id, e);
      grade = 0;
      feedback = "AI grading failed to process this submission.";
    }

    return prisma.assignmentSubmission.update({
      where: { id: sub.id },
      data: {
        grade,
        aiFeedback: feedback,
        status: 'GRADED'
      }
    });
  });

  await Promise.all(updates);

  return NextResponse.json({ message: `Graded ${updates.length} submissions successfully.` });
}
