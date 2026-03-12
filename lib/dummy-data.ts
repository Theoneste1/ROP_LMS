// Dummy data for frontend development
// This allows the frontend to work without database
// Using ONE comprehensive course with all features

// Define quiz first so it can be referenced in courses
const dummyQuizData = {
  id: "quiz-1",
  title: "Number Theory Quiz",
  description: "Test your understanding of number theory basics. This quiz covers prime numbers, divisibility rules, and modular arithmetic.",
  timeLimit: 30,
  passingScore: 70,
  lesson: {
    id: "lesson-1",
    title: "Introduction to Number Theory",
    course: {
      id: "course-1",
      title: "Introduction to Mathematics Olympiad",
      slug: "intro-math-olympiad",
    },
  },
  questions: [
    {
      id: "q1",
      question: "What is the smallest prime number?",
      type: "multiple_choice",
      options: JSON.stringify(["1", "2", "3", "4"]),
      correctAnswer: "2",
      points: 10,
      order: 1,
    },
    {
      id: "q2",
      question: "Is 123 divisible by 3?",
      type: "multiple_choice",
      options: JSON.stringify(["Yes", "No"]),
      correctAnswer: "Yes",
      points: 10,
      order: 2,
    },
    {
      id: "q3",
      question: "What is 17 mod 5?",
      type: "multiple_choice",
      options: JSON.stringify(["1", "2", "3", "4"]),
      correctAnswer: "2",
      points: 15,
      order: 3,
    },
    {
      id: "q4",
      question: "How many prime numbers are there between 1 and 20?",
      type: "multiple_choice",
      options: JSON.stringify(["6", "7", "8", "9"]),
      correctAnswer: "8",
      points: 15,
      order: 4,
    },
    {
      id: "q5",
      question: "What is the remainder when 100 is divided by 7?",
      type: "multiple_choice",
      options: JSON.stringify(["1", "2", "3", "4"]),
      correctAnswer: "2",
      points: 20,
      order: 5,
    },
  ],
}

export const dummyCourses = [
  {
    id: "course-1",
    title: "Introduction to Mathematics Olympiad",
    description: "Master the fundamentals of competitive mathematics and problem-solving techniques used in international olympiads. This comprehensive course covers essential topics including number theory, algebra, geometry, and combinatorics.",
    slug: "intro-math-olympiad",
    thumbnail: "/images/course-1.jpg",
    status: "PUBLISHED" as const,
    learningOutcomes: JSON.stringify([
      "Understand fundamental concepts of number theory including divisibility, prime numbers, and modular arithmetic",
      "Master basic algebraic manipulation techniques and problem-solving strategies",
      "Apply geometric principles to solve olympiad-level problems",
      "Develop logical reasoning and proof-writing skills",
      "Solve complex mathematical problems using multiple approaches",
    ]),
    instructor: {
      id: "instructor-1",
      name: "Dr. Jean Paul Nkurunziza",
      email: "jean.paul@rwandaolympiad.org",
    },
    lessons: [
      { 
        id: "lesson-1", 
        title: "Introduction to Number Theory", 
        type: "TEXT", 
        topic: "Number Theory Fundamentals",
        description: "Introduction to prime numbers, divisibility, and modular arithmetic",
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
        order: 1,
        quiz: dummyQuizData,
      },
      { 
        id: "lesson-2", 
        title: "Basic Algebra Techniques", 
        type: "TEXT",
        topic: "Algebra Basics",
        description: "Essential algebraic manipulation skills",
        content: `# Basic Algebra Techniques

Algebra is the foundation of mathematical problem-solving.

## Topics Covered

- Factorization
- Completing the square
- Vieta's formulas
- Symmetric polynomials

## Practice Problems

1. Factor the expression: x² - 5x + 6
2. Complete the square: x² + 6x + 5
3. Find the sum and product of roots for: 2x² - 7x + 3 = 0`,
        order: 2,
      },
      { 
        id: "lesson-3", 
        title: "Number Theory Quiz", 
        type: "QUIZ",
        topic: "Number Theory Fundamentals",
        description: "Test your understanding of number theory",
        order: 3,
        quiz: dummyQuizData,
      },
      { 
        id: "lesson-4", 
        title: "Triangle Geometry Fundamentals", 
        type: "TEXT",
        topic: "Geometry Concepts",
        description: "Properties of triangles and their applications",
        content: `# Triangle Geometry

Learn about triangle properties, centers, and theorems including:

- **Centroid**: Point where medians meet
- **Circumcenter**: Point where perpendicular bisectors meet
- **Incenter**: Point where angle bisectors meet
- **Orthocenter**: Point where altitudes meet

## Triangle Inequalities

- Sum of any two sides > third side
- Difference of any two sides < third side

## Similarity and Congruence

Two triangles are similar if their angles are equal.
Two triangles are congruent if all sides and angles match.`,
        order: 4,
      },
      { 
        id: "lesson-5", 
        title: "Circle Properties", 
        type: "TEXT",
        topic: "Geometry Concepts",
        description: "Understanding circles and their relationships",
        content: `# Circle Properties

Explore theorems related to circles:

## Power of a Point

If a point P is outside a circle, and lines through P intersect the circle at points A, B and C, D, then PA × PB = PC × PD.

## Inscribed Angles

An inscribed angle is half the measure of its intercepted arc.

## Tangent Properties

A tangent to a circle is perpendicular to the radius at the point of tangency.`,
        order: 5,
      },
      { 
        id: "lesson-6", 
        title: "Geometry Quiz", 
        type: "QUIZ",
        topic: "Geometry Concepts",
        description: "Test your geometry knowledge",
        order: 6,
        quiz: {
          id: "quiz-2",
          title: "Geometry Quiz",
          description: "Test your understanding of triangle and circle geometry",
          timeLimit: 30,
          passingScore: 70,
          questions: [
            {
              id: "q6",
              question: "What is the sum of angles in a triangle?",
              type: "multiple_choice",
              options: JSON.stringify(["90°", "180°", "270°", "360°"]),
              correctAnswer: "180°",
              points: 10,
              order: 1,
            },
            {
              id: "q7",
              question: "How many degrees is an inscribed angle that intercepts a semicircle?",
              type: "multiple_choice",
              options: JSON.stringify(["45°", "90°", "135°", "180°"]),
              correctAnswer: "90°",
              points: 15,
              order: 2,
            },
            {
              id: "q8",
              question: "What is the point where medians of a triangle meet called?",
              type: "multiple_choice",
              options: JSON.stringify(["Centroid", "Circumcenter", "Incenter", "Orthocenter"]),
              correctAnswer: "Centroid",
              points: 15,
              order: 3,
            },
          ],
        },
      },
      { 
        id: "lesson-7", 
        title: "Combinatorics Introduction", 
        type: "TEXT",
        topic: "Combinatorics Basics",
        description: "Counting principles and permutations",
        content: `# Combinatorics Introduction

Combinatorics is the branch of mathematics dealing with counting, arrangement, and combination of objects.

## Fundamental Counting Principle

If one event can occur in m ways and a second event can occur in n ways, then both events together can occur in m × n ways.

## Permutations

Arrangements of objects where order matters.
P(n, r) = n! / (n - r)!

## Combinations

Selections of objects where order doesn't matter.
C(n, r) = n! / (r! × (n - r)!)`,
        order: 7,
      },
      { 
        id: "lesson-8", 
        title: "Combinatorics Quiz", 
        type: "QUIZ",
        topic: "Combinatorics Basics",
        description: "Test your combinatorics knowledge",
        order: 8,
        quiz: {
          id: "quiz-3",
          title: "Combinatorics Quiz",
          description: "Test your understanding of counting principles",
          timeLimit: 25,
          passingScore: 70,
          questions: [
            {
              id: "q9",
              question: "How many ways can you arrange 3 books on a shelf?",
              type: "multiple_choice",
              options: JSON.stringify(["3", "6", "9", "12"]),
              correctAnswer: "6",
              points: 10,
              order: 1,
            },
            {
              id: "q10",
              question: "What is C(5, 2)?",
              type: "multiple_choice",
              options: JSON.stringify(["10", "20", "30", "40"]),
              correctAnswer: "10",
              points: 15,
              order: 2,
            },
          ],
        },
      },
      { 
        id: "lesson-9", 
        title: "Problem Solving Practice", 
        type: "ASSIGNMENT",
        topic: "Problem-Solving Techniques",
        description: "Practice solving olympiad problems",
        order: 9,
      },
    ],
    assignments: [
      {
        id: "assignment-1",
        title: "Introduction to Mathematics Olympiad - Problem Set",
        description: `Solve the following problems and submit your solutions. Show all your work and explain your reasoning.

**Problems:**

1. **Prime Factorization (20 points)**
   Find the prime factorization of 360. Show all steps.

2. **Divisibility Proof (25 points)**
   Prove that the sum of two odd numbers is always even. Use a formal mathematical proof.

3. **Modular Arithmetic (25 points)**
   Solve the equation: 3x ≡ 7 (mod 11). Show your work.

4. **GCD and LCM (30 points)**
   Find the greatest common divisor (GCD) and least common multiple (LCM) of 48 and 72. Show your method.`,
        maxScore: 100,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ],
    _count: {
      enrollments: 125,
      lessons: 9,
    },
    createdAt: new Date("2024-01-15"),
  },
]

export const dummyCourse = dummyCourses[0]

export const dummyLesson = dummyCourses[0].lessons[0]

export const dummyQuiz = dummyQuizData

export const dummyAssignment = {
  id: "assignment-1",
  title: "Introduction to Mathematics Olympiad - Problem Set",
  description: "Solve the following problems and submit your solutions. Show all your work and explain your reasoning.",
  courseId: "course-1",
  instructorId: "instructor-1",
  instructor: {
    id: "instructor-1",
    name: "Dr. Jean Paul Nkurunziza",
    email: "jean.paul@rwandaolympiad.org",
  },
  course: {
    id: "course-1",
    title: "Introduction to Mathematics Olympiad",
    slug: "intro-math-olympiad",
  },
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  maxScore: 100,
  createdAt: new Date("2024-01-20"),
}

export const dummyEnrollments = [
  {
    id: "enrollment-1",
    userId: "user-1",
    courseId: "course-1",
    status: "ACTIVE" as const,
    enrolledAt: new Date("2024-01-16"),
    course: {
      id: "course-1",
      title: "Introduction to Mathematics Olympiad",
      slug: "intro-math-olympiad",
      instructor: {
        name: "Dr. Jean Paul Nkurunziza",
        email: "jean.paul@rwandaolympiad.org",
      },
      lessons: dummyCourses[0].lessons,
      assignments: dummyCourses[0].assignments,
      _count: {
        enrollments: 125,
      },
    },
  },
]

export const dummyProgress = [
  {
    id: "progress-1",
    userId: "user-1",
    lessonId: "lesson-1",
    enrollmentId: "enrollment-1",
    completed: true,
    completedAt: new Date("2024-01-16"),
  },
  {
    id: "progress-2",
    userId: "user-1",
    lessonId: "lesson-2",
    enrollmentId: "enrollment-1",
    completed: true,
    completedAt: new Date("2024-01-17"),
  },
  {
    id: "progress-3",
    userId: "user-1",
    lessonId: "lesson-4",
    enrollmentId: "enrollment-1",
    completed: true,
    completedAt: new Date("2024-01-18"),
  },
]

export const dummyAssignments = [
  {
    id: "assignment-1",
    title: "Introduction to Mathematics Olympiad - Problem Set",
    description: "Solve problems related to prime numbers, modular arithmetic, geometry, and combinatorics",
    courseId: "course-1",
    course: {
      id: "course-1",
      title: "Introduction to Mathematics Olympiad",
      slug: "intro-math-olympiad",
    },
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxScore: 100,
    submissions: [],
  },
]

// Dummy Tests Data
export const dummyTests = [
  {
    id: "test-1",
    title: "Number Theory Practice Test",
    description: "Comprehensive practice test covering prime numbers, divisibility, and modular arithmetic",
    type: "PRACTICE_TEST",
    status: "PUBLISHED",
    timeLimit: 60,
    totalMarks: 100,
    documentUrl: "/uploads/tests/number-theory-test.pdf",
    documentName: "Number Theory Practice Test.pdf",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "test-2",
    title: "Algebra Fundamentals Test",
    description: "Test your algebra skills with problems on equations, inequalities, and polynomials",
    type: "PRACTICE_TEST",
    status: "PUBLISHED",
    timeLimit: 90,
    totalMarks: 120,
    documentUrl: "/uploads/tests/algebra-test.pdf",
    documentName: "Algebra Fundamentals Test.pdf",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "test-3",
    title: "Geometry Challenge Test",
    description: "Advanced geometry problems covering triangles, circles, and coordinate geometry",
    type: "PRACTICE_TEST",
    status: "PUBLISHED",
    timeLimit: 75,
    totalMarks: 100,
    documentUrl: "/uploads/tests/geometry-test.pdf",
    documentName: "Geometry Challenge Test.pdf",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Dummy Past Papers Data
export const dummyPastPapers = [
  {
    id: "paper-1",
    title: "Rwanda Mathematics Olympiad 2023",
    description: "Complete past paper from the 2023 Rwanda Mathematics Olympiad competition",
    type: "PAST_PAPER",
    status: "PUBLISHED",
    year: 2023,
    olympiadType: "RMO",
    totalMarks: 100,
    documentUrl: "/uploads/past-papers/rmo-2023-questions.pdf",
    documentName: "RMO 2023 Questions.pdf",
    solutionUrl: "/uploads/past-papers/rmo-2023-solutions.pdf",
    solutionName: "RMO 2023 Solutions.pdf",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "paper-2",
    title: "Rwanda Mathematics Olympiad 2022",
    description: "Complete past paper from the 2022 Rwanda Mathematics Olympiad competition",
    type: "PAST_PAPER",
    status: "PUBLISHED",
    year: 2022,
    olympiadType: "RMO",
    totalMarks: 100,
    documentUrl: "/uploads/past-papers/rmo-2022-questions.pdf",
    documentName: "RMO 2022 Questions.pdf",
    solutionUrl: "/uploads/past-papers/rmo-2022-solutions.pdf",
    solutionName: "RMO 2022 Solutions.pdf",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "paper-3",
    title: "IMO 2023 Problems",
    description: "International Mathematics Olympiad 2023 problems with detailed solutions",
    type: "PAST_PAPER",
    status: "PUBLISHED",
    year: 2023,
    olympiadType: "IMO",
    totalMarks: 42,
    documentUrl: "/uploads/past-papers/imo-2023-questions.pdf",
    documentName: "IMO 2023 Problems.pdf",
    solutionUrl: "/uploads/past-papers/imo-2023-solutions.pdf",
    solutionName: "IMO 2023 Solutions.pdf",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "paper-4",
    title: "AMC 8 2023",
    description: "American Mathematics Competition 8 - 2023 problems and solutions",
    type: "PAST_PAPER",
    status: "PUBLISHED",
    year: 2023,
    olympiadType: "AMC",
    totalMarks: 25,
    documentUrl: "/uploads/past-papers/amc8-2023-questions.pdf",
    documentName: "AMC 8 2023 Questions.pdf",
    solutionUrl: "/uploads/past-papers/amc8-2023-solutions.pdf",
    solutionName: "AMC 8 2023 Solutions.pdf",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
