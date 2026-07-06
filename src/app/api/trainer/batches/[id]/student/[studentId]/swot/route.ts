import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request, { params }: { params: Promise<{ id: string, studentId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'TRAINER') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const { id: batchId, studentId } = await params;

    const hasAccess = await prisma.classSession.findFirst({
      where: { batchId, trainerId: session.user.id }
    });

    if (!hasAccess) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const student = await prisma.user.findUnique({ where: { id: studentId } });
    
    // Get Assignments
    const assignments = await prisma.assignment.findMany({
      where: { batchId },
      include: {
        submissions: { where: { userId: studentId } }
      }
    });

    // Get Attendance
    const attendanceRecords = await prisma.attendance.findMany({
      where: { userId: studentId, classSession: { batchId } }
    });
    const totalClasses = await prisma.classSession.count({ where: { batchId } });
    const attended = attendanceRecords.filter(r => r.status === 'PRESENT').length;
    const attendancePercentage = totalClasses === 0 ? 0 : Math.round((attended / totalClasses) * 100);

    // Compile Prompt Data
    const assignmentContext = assignments.map(a => {
      const sub = a.submissions[0];
      return `- ${a.title}: ${sub ? `Grade: ${sub.grade || 'N/A'}/100. Feedback: ${sub.aiFeedback || 'None'}` : 'Not submitted'}`;
    }).join('\n');

    const prompt = `You are an expert AI Education Counselor. Please perform a detailed SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis for a student based on their academic data in a programming/tech course.

Student Name: ${student?.name || 'Student'}
Attendance: ${attended}/${totalClasses} classes attended (${attendancePercentage}%)

Assignments Performance:
${assignmentContext || 'No assignments data available.'}

Provide your analysis in EXACT JSON format with four string arrays, like this:
{
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "opportunities": ["string", "string"],
  "threats": ["string", "string"]
}
Ensure each array has 2 to 4 bullet points that are highly specific to the provided data. Do not include markdown blocks or any other text outside the JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const responseText = response.text?.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(responseText || '{}');

    return NextResponse.json({
      strengths: parsed.strengths || ["Data insufficient"],
      weaknesses: parsed.weaknesses || ["Data insufficient"],
      opportunities: parsed.opportunities || ["Data insufficient"],
      threats: parsed.threats || ["Data insufficient"],
    });

  } catch (error: any) {
    console.error("SWOT API Error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
