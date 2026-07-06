import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Admin User
  const adminPassword = await bcrypt.hash('changeme123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@learnzlab.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@learnzlab.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created/updated');

  // 2. Trainer User
  const trainerPassword = await bcrypt.hash('trainer123', 10);
  const trainer = await prisma.user.upsert({
    where: { email: 'surya@learnzlab.com' },
    update: {},
    create: {
      name: 'Surya Kumar',
      email: 'surya@learnzlab.com',
      password: trainerPassword,
      role: 'TRAINER',
    },
  });
  console.log('Trainer user created/updated');

  // 3. Courses
  const coursesData = [
    {
      title: 'Data Science and AI with Python',
      slug: 'data-science-and-ai-with-python',
      duration: '11 Months',
      category: 'Data Science',
      features: JSON.stringify(['Hands-on ML Projects', '100% Job Assistance', '12 Lessons']),
    },
    {
      title: 'Deep Learning with Python',
      slug: 'deep-learning-with-python',
      duration: '6 Months',
      category: 'Data Science',
      features: JSON.stringify(['Projects in CNN, RNN & NLP', '100% Job Assistance', '12 Lessons']),
    },
    {
      title: 'Machine Learning with Python',
      slug: 'machine-learning-with-python',
      duration: '6 Months',
      category: 'Machine Learning',
      features: JSON.stringify(['End-to-End ML Model Deployment', '8+ Years Industry Expertise', '12 Lessons']),
    },
    {
      title: 'Data Science with Python',
      slug: 'data-science-with-python',
      duration: '4 Months',
      category: 'Data Science',
      features: JSON.stringify(['100% Job Assistance', '8+ Years Industry Experience', '12 Lessons']),
    },
    {
      title: 'Data Analytics with Python',
      slug: 'data-analytics-with-python',
      duration: '4 Months',
      category: 'Data Analytics',
      features: JSON.stringify(['Highest CTC Achieved: ₹10 LPA', '100% Job Assistance', '12 Lessons']),
    },
    {
      title: 'Business Analytics',
      slug: 'business-analytics',
      duration: '3 Months',
      category: 'Data Analytics',
      features: JSON.stringify(['100% Job Assistance', 'Industry-Recognized Certification', '12 Lessons']),
    },
    {
      title: 'Data Visualisation With Power BI',
      slug: 'data-visualisation-with-power-bi',
      duration: '2 Months',
      category: 'Data Visualization',
      features: JSON.stringify(['Dashboard Creation', 'Real-time Analytics']),
    },
    {
      title: 'Data Visualisation With Tableau',
      slug: 'data-visualisation-with-tableau',
      duration: '2 Months',
      category: 'Data Visualization',
      features: JSON.stringify(['Interactive Dashboards', 'Data Storytelling']),
    },
  ];

  for (const course of coursesData) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {
        title: course.title,
        duration: course.duration,
        category: course.category,
        features: course.features,
        isPublished: true,
      },
      create: {
        title: course.title,
        slug: course.slug,
        duration: course.duration,
        category: course.category,
        features: course.features,
        isPublished: true,
      },
    });
  }
  console.log('Courses created/updated');

  // 4. Sample Batch
  const dataScienceCourse = await prisma.course.findUnique({
    where: { slug: 'data-science-and-ai-with-python' }
  });

  if (dataScienceCourse) {
    const existingBatch = await prisma.batch.findFirst({
      where: { name: 'Cohort 1 - Data Science' }
    });

    if (!existingBatch) {
      await prisma.batch.create({
        data: {
          name: 'Cohort 1 - Data Science',
          description: 'First cohort for Data Science and AI',
          status: 'ACTIVE',
          courseId: dataScienceCourse.id,
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 11)),
        }
      });
      console.log('Sample batch created');
    }
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
