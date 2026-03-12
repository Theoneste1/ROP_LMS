// Seed script to populate all tables except users and admin
// This script assumes users already exist in the database
require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

const CourseStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
}

const LessonType = {
  TEXT: 'TEXT',
  VIDEO: 'VIDEO',
  QUIZ: 'QUIZ',
  ASSIGNMENT: 'ASSIGNMENT',
}

const EnrollmentStatus = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  DROPPED: 'DROPPED',
}

const SubmissionStatus = {
  PENDING: 'PENDING',
  SUBMITTED: 'SUBMITTED',
  GRADED: 'GRADED',
}

async function main() {
  console.log('🌱 Starting dummy data generation (excluding users and admin)...\n')

  try {
    // Get existing users from database
    const instructors = await prisma.user.findMany({
      where: { role: 'INSTRUCTOR' },
    })

    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
    })

    if (instructors.length === 0) {
      console.log('⚠️  No instructors found. Please create at least one instructor user first.')
      return
    }

    if (students.length === 0) {
      console.log('⚠️  No students found. Please create at least one student user first.')
      return
    }

    console.log(`✅ Found ${instructors.length} instructor(s) and ${students.length} student(s)\n`)

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Cleaning existing data...')
    await prisma.answer.deleteMany({})
    await prisma.quizAttempt.deleteMany({})
    await prisma.question.deleteMany({})
    await prisma.quiz.deleteMany({})
    await prisma.submission.deleteMany({})
    await prisma.assignment.deleteMany({})
    await prisma.progress.deleteMany({})
    await prisma.enrollment.deleteMany({})
    await prisma.lesson.deleteMany({})
    await prisma.course.deleteMany({})
    console.log('✅ Existing data cleaned\n')

    // Create Courses
    console.log('📚 Creating courses...')
    const courses = []

    const courseData = [
      {
        title: 'Introduction to Mathematics Olympiad',
        description: 'Master the fundamentals of competitive mathematics and problem-solving techniques used in international olympiads. This comprehensive course covers essential topics including number theory, algebra, geometry, and combinatorics.',
        slug: 'intro-math-olympiad',
        status: CourseStatus.PUBLISHED,
        learningOutcomes: JSON.stringify([
          'Understand fundamental concepts of number theory including divisibility, prime numbers, and modular arithmetic',
          'Master basic algebraic manipulation techniques and problem-solving strategies',
          'Apply geometric principles to solve olympiad-level problems',
          'Develop logical reasoning and proof-writing skills',
          'Solve complex mathematical problems using multiple approaches',
        ]),
      },
      {
        title: 'Advanced Algebra and Number Theory',
        description: 'Deep dive into advanced algebraic techniques and number theory concepts. Learn modular arithmetic, Diophantine equations, and polynomial theory.',
        slug: 'advanced-algebra-number-theory',
        status: CourseStatus.PUBLISHED,
        learningOutcomes: JSON.stringify([
          'Master advanced modular arithmetic and Chinese Remainder Theorem',
          'Solve Diophantine equations and polynomial problems',
          'Apply advanced number theory concepts to olympiad problems',
          'Understand and use advanced algebraic techniques',
        ]),
      },
      {
        title: 'Geometry Mastery',
        description: 'Comprehensive geometry course covering triangle properties, circle theorems, coordinate geometry, and transformation geometry.',
        slug: 'geometry-mastery',
        status: CourseStatus.PUBLISHED,
        learningOutcomes: JSON.stringify([
          'Master triangle geometry including centers and special points',
          'Understand circle theorems and their applications',
          'Apply coordinate geometry to solve complex problems',
          'Use transformation geometry in problem-solving',
        ]),
      },
      {
        title: 'Combinatorics and Probability',
        description: 'Learn counting principles, permutations, combinations, and probability theory essential for olympiad competitions.',
        slug: 'combinatorics-probability',
        status: CourseStatus.PUBLISHED,
        learningOutcomes: JSON.stringify([
          'Master fundamental counting principles',
          'Understand permutations, combinations, and their applications',
          'Solve probability problems using various techniques',
          'Apply combinatorial reasoning to olympiad problems',
        ]),
      },
      {
        title: 'Problem Solving Strategies',
        description: 'Develop advanced problem-solving techniques and strategies for tackling challenging olympiad problems.',
        slug: 'problem-solving-strategies',
        status: CourseStatus.DRAFT,
        learningOutcomes: JSON.stringify([
          'Develop systematic problem-solving approaches',
          'Learn to recognize patterns and apply appropriate techniques',
          'Master proof techniques including contradiction and induction',
          'Apply multiple strategies to solve challenging problems',
        ]),
      },
    ]

    for (let i = 0; i < courseData.length; i++) {
      const instructor = instructors[i % instructors.length]
      const course = await prisma.course.create({
        data: {
          title: courseData[i].title,
          description: courseData[i].description,
          slug: courseData[i].slug,
          status: courseData[i].status,
          learningOutcomes: courseData[i].learningOutcomes,
          instructorId: instructor.id,
        },
      })
      courses.push(course)
      console.log(`  ✅ Created: ${course.title}`)
    }
    console.log(`\n✅ Created ${courses.length} courses\n`)

    // Create Lessons for each course
    console.log('📖 Creating lessons...')
    const lessons = []
    const quizLessons = []

    const lessonTemplates = [
      {
        title: 'Introduction to Number Theory',
        description: 'Learn the basics of number theory and divisibility',
        content: `# Introduction to Number Theory

Number theory is one of the most fundamental branches of mathematics, dealing with the properties and relationships of integers.

## Key Concepts

1. **Divisibility**: Understanding when one number divides another
2. **Prime Numbers**: Numbers divisible only by 1 and themselves
3. **GCD and LCM**: Greatest Common Divisor and Least Common Multiple
4. **Modular Arithmetic**: Working with remainders

## Example Problem

Find all positive integers n such that n² + 1 is divisible by n + 1.

**Solution**: Use polynomial division and divisibility properties.`,
        type: LessonType.TEXT,
      },
      {
        title: 'Basic Algebra Techniques',
        description: 'Essential algebraic manipulation skills',
        content: `# Basic Algebra Techniques

Algebra is the foundation of mathematical problem-solving.

## Topics Covered

- Factorization
- Completing the square
- Vieta's formulas
- Symmetric polynomials`,
        type: LessonType.TEXT,
      },
      {
        title: 'Number Theory Quiz',
        description: 'Test your understanding of number theory',
        type: LessonType.QUIZ,
      },
      {
        title: 'Triangle Geometry Fundamentals',
        description: 'Properties of triangles and their applications',
        content: `# Triangle Geometry

Learn about triangle properties, centers, and theorems including:
- Centroid, circumcenter, incenter, orthocenter
- Triangle inequalities
- Similarity and congruence`,
        type: LessonType.TEXT,
      },
      {
        title: 'Circle Properties',
        description: 'Understanding circles and their relationships',
        content: `# Circle Properties

Explore theorems related to circles:
- Power of a point
- Inscribed angles
- Tangent properties`,
        type: LessonType.TEXT,
      },
      {
        title: 'Geometry Problem Solving',
        description: 'Practice solving geometry problems',
        type: LessonType.ASSIGNMENT,
      },
      {
        title: 'Counting Principles',
        description: 'Learn fundamental counting techniques',
        content: `# Counting Principles

Master the art of counting:
- Addition and multiplication principles
- Permutations
- Combinations`,
        type: LessonType.TEXT,
      },
      {
        title: 'Probability Basics',
        description: 'Introduction to probability theory',
        content: `# Probability Basics

Understanding probability:
- Sample spaces
- Events
- Conditional probability`,
        type: LessonType.TEXT,
      },
      {
        title: 'Combinatorics Quiz',
        description: 'Test your combinatorics knowledge',
        type: LessonType.QUIZ,
      },
      {
        title: 'Problem Solving Techniques',
        description: 'Strategies for approaching olympiad problems',
        content: `# Problem Solving Techniques

Learn effective strategies:
- Working backwards
- Pattern recognition
- Proof by contradiction`,
        type: LessonType.TEXT,
      },
    ]

    for (const course of courses) {
      const courseLessons = lessonTemplates.slice(0, Math.floor(Math.random() * 5) + 3) // 3-7 lessons per course
      
      // Group lessons by topic/subtopic
      const topics = ['Fundamentals', 'Advanced Concepts', 'Problem Solving', 'Practice']
      let currentTopicIndex = 0
      
      for (let i = 0; i < courseLessons.length; i++) {
        const template = courseLessons[i]
        // Assign topic based on lesson position
        const topic = topics[currentTopicIndex % topics.length]
        if (i > 0 && i % 3 === 0) currentTopicIndex++
        
        const lesson = await prisma.lesson.create({
          data: {
            title: template.title,
            description: template.description,
            content: template.content || null,
            type: template.type,
            topic: topic,
            order: i + 1,
            courseId: course.id,
          },
        })
        lessons.push(lesson)
        
        if (template.type === LessonType.QUIZ) {
          quizLessons.push(lesson)
        }
        
        console.log(`  ✅ Created lesson: ${lesson.title} for ${course.title}`)
      }
    }
    console.log(`\n✅ Created ${lessons.length} lessons\n`)

    // Create Quizzes and Questions
    console.log('📝 Creating quizzes and questions...')
    const quizzes = []

    for (const lesson of quizLessons) {
      const quiz = await prisma.quiz.create({
        data: {
          title: `${lesson.title} - Assessment`,
          description: `Test your understanding of ${lesson.title}`,
          timeLimit: 30,
          passingScore: 70,
          lessonId: lesson.id,
        },
      })
      quizzes.push(quiz)

      // Create questions for each quiz
      const questions = [
        {
          question: 'What is the greatest common divisor of 48 and 72?',
          type: 'multiple_choice',
          options: JSON.stringify(['12', '24', '48', '72']),
          correctAnswer: '24',
          points: 10,
          order: 1,
        },
        {
          question: 'How many prime numbers are there between 1 and 20?',
          type: 'multiple_choice',
          options: JSON.stringify(['6', '7', '8', '9']),
          correctAnswer: '8',
          points: 10,
          order: 2,
        },
        {
          question: 'True or False: Every even number greater than 2 can be expressed as the sum of two primes.',
          type: 'true_false',
          options: null,
          correctAnswer: 'True',
          points: 15,
          order: 3,
        },
        {
          question: 'What is the least common multiple of 12 and 18?',
          type: 'short_answer',
          options: null,
          correctAnswer: '36',
          points: 15,
          order: 4,
        },
        {
          question: 'Which of the following is a prime number?',
          type: 'multiple_choice',
          options: JSON.stringify(['15', '21', '23', '27']),
          correctAnswer: '23',
          points: 10,
          order: 5,
        },
      ]

      await prisma.question.createMany({
        data: questions.map(q => ({
          ...q,
          quizId: quiz.id,
        })),
      })

      console.log(`  ✅ Created quiz with ${questions.length} questions for ${lesson.title}`)
    }
    console.log(`\n✅ Created ${quizzes.length} quizzes\n`)

    // Create Assignments
    console.log('📋 Creating assignments...')
    const assignments = []

    for (const course of courses.slice(0, 3)) { // Create assignments for first 3 courses
      const instructor = instructors.find(i => i.id === course.instructorId) || instructors[0]
      
      const assignment = await prisma.assignment.create({
        data: {
          title: `${course.title} - Problem Set`,
          description: 'Solve the following problems and submit your solutions. Show all your work and explain your reasoning.',
          maxScore: 100,
          dueDate: new Date(Date.now() + (Math.random() * 14 + 7) * 24 * 60 * 60 * 1000), // 7-21 days from now
          courseId: course.id,
          instructorId: instructor.id,
        },
      })
      assignments.push(assignment)
      console.log(`  ✅ Created assignment: ${assignment.title}`)
    }
    console.log(`\n✅ Created ${assignments.length} assignments\n`)

    // Create Enrollments
    console.log('👥 Creating enrollments...')
    let enrollmentCount = 0

    for (const course of courses) {
      // Enroll random students (at least 2, up to all students)
      const numEnrollments = Math.min(Math.floor(Math.random() * students.length) + 2, students.length)
      const enrolledStudents = students.slice(0, numEnrollments)

      for (const student of enrolledStudents) {
        const enrollment = await prisma.enrollment.create({
          data: {
            userId: student.id,
            courseId: course.id,
            status: Math.random() > 0.8 ? EnrollmentStatus.COMPLETED : EnrollmentStatus.ACTIVE,
            completedAt: Math.random() > 0.8 ? new Date() : null,
          },
        })
        enrollmentCount++
      }
      console.log(`  ✅ Enrolled ${enrolledStudents.length} students in ${course.title}`)
    }
    console.log(`\n✅ Created ${enrollmentCount} enrollments\n`)

    // Create Progress records
    console.log('📊 Creating progress records...')
    const enrollments = await prisma.enrollment.findMany({
      include: {
        course: {
          include: {
            lessons: true,
          },
        },
      },
    })

    let progressCount = 0
    for (const enrollment of enrollments) {
      const courseLessons = enrollment.course.lessons
      const numCompleted = Math.floor(Math.random() * courseLessons.length * 0.6) // Complete up to 60% of lessons

      for (let i = 0; i < numCompleted && i < courseLessons.length; i++) {
        const lesson = courseLessons[i]
        await prisma.progress.create({
          data: {
            userId: enrollment.userId,
            lessonId: lesson.id,
            enrollmentId: enrollment.id,
            completed: true,
            completedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
          },
        })
        progressCount++
      }
    }
    console.log(`\n✅ Created ${progressCount} progress records\n`)

    // Create Quiz Attempts and Answers
    console.log('✏️  Creating quiz attempts and answers...')
    let attemptCount = 0
    let answerCount = 0

    for (const quiz of quizzes) {
      const lesson = lessons.find(l => l.id === quiz.lessonId)
      if (!lesson) continue

      const course = courses.find(c => c.id === lesson.courseId)
      if (!course) continue

      // Get students enrolled in this course
      const courseEnrollments = enrollments.filter(e => e.courseId === course.id)
      const attemptStudents = courseEnrollments.slice(0, Math.floor(courseEnrollments.length * 0.7)) // 70% attempt quizzes

      for (const enrollment of attemptStudents) {
        const questions = await prisma.question.findMany({
          where: { quizId: quiz.id },
          orderBy: { order: 'asc' },
        })

        const attempt = await prisma.quizAttempt.create({
          data: {
            quizId: quiz.id,
            userId: enrollment.userId,
            completed: Math.random() > 0.3, // 70% complete quizzes
            score: Math.random() > 0.3 ? Math.floor(Math.random() * 40) + 60 : null, // Score between 60-100 if completed
            completedAt: Math.random() > 0.3 ? new Date() : null,
          },
        })
        attemptCount++

        // Create answers for completed attempts
        if (attempt.completed) {
          for (const question of questions) {
            let answer = ''
            let isCorrect = false

            if (question.type === 'multiple_choice' && question.options) {
              const options = JSON.parse(question.options)
              answer = options[Math.floor(Math.random() * options.length)]
              isCorrect = answer === question.correctAnswer
            } else if (question.type === 'true_false') {
              answer = Math.random() > 0.5 ? 'True' : 'False'
              isCorrect = answer === question.correctAnswer
            } else {
              // For short answer, sometimes correct, sometimes close
              if (Math.random() > 0.3) {
                answer = question.correctAnswer
                isCorrect = true
              } else {
                answer = 'Incorrect answer'
                isCorrect = false
              }
            }

            await prisma.answer.create({
              data: {
                attemptId: attempt.id,
                questionId: question.id,
                answer,
                isCorrect,
              },
            })
            answerCount++
          }
        }
      }
    }
    console.log(`\n✅ Created ${attemptCount} quiz attempts and ${answerCount} answers\n`)

    // Create Submissions
    console.log('📤 Creating submissions...')
    let submissionCount = 0

    for (const assignment of assignments) {
      const course = courses.find(c => c.id === assignment.courseId)
      if (!course) continue

      const courseEnrollments = enrollments.filter(e => e.courseId === course.id)
      const submittingStudents = courseEnrollments.slice(0, Math.floor(courseEnrollments.length * 0.6)) // 60% submit

      for (const enrollment of submittingStudents) {
        const statuses = [SubmissionStatus.SUBMITTED, SubmissionStatus.GRADED, SubmissionStatus.PENDING]
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        const isGraded = status === SubmissionStatus.GRADED

        await prisma.submission.create({
          data: {
            assignmentId: assignment.id,
            userId: enrollment.userId,
            content: `Here is my solution to the assignment problems:\n\nProblem 1: [Solution details]\nProblem 2: [Solution details]\nProblem 3: [Solution details]`,
            fileUrl: Math.random() > 0.7 ? 'https://example.com/submissions/file.pdf' : null,
            status,
            score: isGraded ? Math.floor(Math.random() * 30) + 70 : null, // Score between 70-100 if graded
            feedback: isGraded ? 'Good work! Your solutions demonstrate a solid understanding of the concepts.' : null,
            submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date in last 7 days
            gradedAt: isGraded ? new Date() : null,
          },
        })
        submissionCount++
      }
    }
    console.log(`\n✅ Created ${submissionCount} submissions\n`)

    // Summary
    console.log('\n' + '='.repeat(50))
    console.log('🎉 Dummy data generation completed successfully!')
    console.log('='.repeat(50))
    console.log(`\n📊 Summary:`)
    console.log(`  ✅ Courses: ${courses.length}`)
    console.log(`  ✅ Lessons: ${lessons.length}`)
    console.log(`  ✅ Quizzes: ${quizzes.length}`)
    console.log(`  ✅ Assignments: ${assignments.length}`)
    console.log(`  ✅ Enrollments: ${enrollmentCount}`)
    console.log(`  ✅ Progress Records: ${progressCount}`)
    console.log(`  ✅ Quiz Attempts: ${attemptCount}`)
    console.log(`  ✅ Answers: ${answerCount}`)
    console.log(`  ✅ Submissions: ${submissionCount}`)
    console.log('\n✨ All dummy data has been created successfully!\n')

  } catch (error) {
    console.error('\n❌ Error generating dummy data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('Fatal error:', e)
    process.exit(1)
  })
