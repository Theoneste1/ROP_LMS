
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rolms.rw' },
    update: {},
    create: {
      email: 'admin@rolms.rw',
      name: 'System Administrator',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin:', admin.email)

  // Instructors
  const instructorPassword = await bcrypt.hash('instructor123', 10)
  const instructor1 = await prisma.user.upsert({
    where: { email: 'instructor1@rolms.rw' },
    update: {},
    create: {
      email: 'instructor1@rolms.rw',
      name: 'Dr. Jean Baptiste',
      password: instructorPassword,
      role: 'INSTRUCTOR',
    },
  })
  console.log('✅ Instructor 1:', instructor1.email)

  const instructor2 = await prisma.user.upsert({
    where: { email: 'instructor2@rolms.rw' },
    update: {},
    create: {
      email: 'instructor2@rolms.rw',
      name: 'Prof. Marie Claire',
      password: instructorPassword,
      role: 'INSTRUCTOR',
    },
  })
  console.log('✅ Instructor 2:', instructor2.email)

  // Students
  const studentPassword = await bcrypt.hash('student123', 10)
  for (let i = 1; i <= 5; i++) {
    const student = await prisma.user.upsert({
      where: { email: `student${i}@rolms.rw` },
      update: {},
      create: {
        email: `student${i}@rolms.rw`,
        name: `Student ${i}`,
        password: studentPassword,
        role: 'STUDENT',
      },
    })
    console.log(`✅ Student ${i}:`, student.email)
  }

  // Course 1
  const course1 = await prisma.course.upsert({
    where: { slug: 'intro-olympiad-mathematics' },
    update: {},
    create: {
      title: 'Introduction to Olympiad Mathematics',
      description: 'A comprehensive introduction to mathematical problem-solving techniques.',
      slug: 'intro-olympiad-mathematics',
      status: 'PUBLISHED',
      instructorId: instructor1.id,
    },
  })
  console.log('✅ Course 1:', course1.title)

  // Lessons for Course 1
  const lesson1_1 = await prisma.lesson.create({
    data: {
      title: 'Introduction to Number Theory',
      description: 'Learn the basics of number theory',
      content: '# Number Theory\n\nLearn fundamentals.',
      type: 'TEXT',
      order: 1,
      courseId: course1.id,
    },
  })

  const lesson1_2 = await prisma.lesson.create({
    data: {
      title: 'Basic Algebra Techniques',
      description: 'Essential algebraic skills',
      content: '# Algebra\n\nLearn techniques.',
      type: 'TEXT',
      order: 2,
      courseId: course1.id,
    },
  })

  const lesson1_3 = await prisma.lesson.create({
    data: {
      title: 'Number Theory Quiz',
      description: 'Test your understanding',
      type: 'QUIZ',
      order: 3,
      courseId: course1.id,
    },
  })

  // Quiz
  const quiz1 = await prisma.quiz.create({
    data: {
      title: 'Number Theory Assessment',
      description: 'Test your knowledge',
      timeLimit: 30,
      passingScore: 70,
      lessonId: lesson1_3.id,
    },
  })

  // Questions
  await prisma.question.createMany({
    data: [
      {
        question: 'What is the GCD of 48 and 72?',
        type: 'multiple_choice',
        options: JSON.stringify(['12', '24', '48', '72']),
        correctAnswer: '24',
        points: 10,
        order: 1,
        quizId: quiz1.id,
      },
      {
        question: 'How many primes between 1 and 20?',
        type: 'multiple_choice',
        options: JSON.stringify(['6', '7', '8', '9']),
        correctAnswer: '8',
        points: 10,
        order: 2,
        quizId: quiz1.id,
      },
    ],
  })

  // Course 2
  const course2 = await prisma.course.upsert({
    where: { slug: 'advanced-geometry' },
    update: {},
    create: {
      title: 'Advanced Geometry for Olympiads',
      description: 'Master geometric problem-solving.',
      slug: 'advanced-geometry',
      status: 'PUBLISHED',
      instructorId: instructor2.id,
    },
  })
  console.log('✅ Course 2:', course2.title)

  // Enrollments
  const students = await prisma.user.findMany({ where: { role: 'STUDENT' } })
  for (const student of students.slice(0, 3)) {
    await prisma.enrollment.create({
      data: { userId: student.id, courseId: course1.id },
    })
  }
  for (const student of students.slice(0, 2)) {
    await prisma.enrollment.create({
      data: { userId: student.id, courseId: course2.id },
    })
  }

  console.log('\n🎉 Seed completed!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
