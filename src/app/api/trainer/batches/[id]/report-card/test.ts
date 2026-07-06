import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const batchId = 'test'; // Just checking syntax/logic for now.
  
  // Get all students in batch
  const batchStudents = await prisma.batchStudent.findMany({
    where: { batchId: batchId },
    include: { user: { select: { id: true, name: true, email: true } } }
  });

  // Get all classes for this batch to calculate attendance %
  const classSessions = await prisma.classSession.findMany({
    where: { batchId: batchId, status: 'COMPLETED' },
    select: { id: true }
  });
  const totalClasses = classSessions.length;
  const classIds = classSessions.map(c => c.id);

  const attendanceRecords = await prisma.attendance.findMany({
    where: { classSessionId: { in: classIds.length > 0 ? classIds : [''] } }
  });

  // Get all assignments for this batch
  const assignments = await prisma.assignment.findMany({
    where: { batchId: batchId },
    select: { id: true }
  });
  const assignmentIds = assignments.map(a => a.id);

  const submissions = await prisma.assignmentSubmission.findMany({
    where: { assignmentId: { in: assignmentIds.length > 0 ? assignmentIds : [''] } }
  });
  
  console.log("SUCCESS");
}

main().catch(console.error).finally(() => prisma.$disconnect());
