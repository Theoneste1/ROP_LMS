# 🇷🇼 Rwanda Olympiad LMS (ROLMS)

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.4-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**Rwanda Olympiad LMS (ROLMS)** — A complete, production-ready Learning Management System designed specifically for Mathematics Olympiad training. Built for the Rwanda Olympiad Foundation to support structured Olympiad mathematics education, student-instructor collaboration, and comprehensive administrative oversight.

## 🎯 What is ROLMS?

ROLMS is a scalable, secure, modular Learning Management System that:

- ✅ Supports structured Olympiad mathematics training
- ✅ Enables collaboration between students and instructors  
- ✅ Provides full administrative oversight
- ✅ Implements strict Role-Based Access Control (RBAC)
- ✅ Is production-ready and scalable
- ✅ Is cleanly architected and maintainable
- ✅ Is future-expansion ready

The system is designed as long-term national education infrastructure for Rwanda.

🌐 **Live Website:** [rwandaolympiad.org](https://rwandaolympiad.org)

---

## 📋 Table of Contents

- [About ROF](#about-rof)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [SEO Optimization](#seo-optimization)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🎯 About ROF

The Rwanda Olympiad Program is dedicated to nurturing Rwanda's future innovators through excellence in STEM education. We:

- 🔬 **Train 500+ students** annually in Mathematics, Physics, Computing, and AI
- 🏆 **Win 50+ international medals** at global competitions
- 🎓 **Support university admissions** to MIT, Harvard, Yale, Cambridge, Carnegie Mellon, and more
- 🌍 **Represent Rwanda** at international Olympiad competitions
- 🤝 **Partner with leading institutions** to provide world-class training

---

## ✨ Core Features

### 🔐 Authentication & Security
- Secure user registration and login
- Password hashing with bcryptjs
- Token-based authentication (JWT)
- Role-aware access control
- Protected routes with middleware
- Input validation with Zod

### 👥 Role-Based Access Control (RBAC)
- **Administrator**: Full system control, user management, course moderation
- **Instructor**: Course creation, lesson management, quiz creation, student monitoring
- **Student**: Course enrollment, lesson completion, quiz taking, progress tracking

### 📚 Course Management
- Create, edit, delete courses
- Course visibility control (Draft/Published/Archived)
- Instructor ownership assignment
- Structured academic organization

### 📖 Lesson Management
- Ordered lessons within courses
- Text content support
- Video URL support
- **Document attachments** (PDF, DOCX, etc.)
- Sequential lesson unlocking
- Lesson completion tracking

### 🎯 Quiz & Assessment System
- Multiple-choice questions
- True/False questions
- Short-answer questions
- Automatic grading
- Score recording and history
- Performance tracking

### 📝 Assignment System
- Assignment creation and management
- Student submission handling
- Instructor grading with feedback
- Score tracking

### 📊 Progress Tracking
- Real-time completion tracking
- Course completion percentage
- Quiz score history
- Assignment submission tracking
- Dashboard statistics

### 🎨 User Experience
- Fully responsive design
- Modern UI/UX with Tailwind CSS
- Accessible components (Radix UI)
- Intuitive navigation

### 🔍 SEO Features
- Complete metadata system with Open Graph & Twitter Cards
- Structured Data (JSON-LD) for rich snippets
- Dynamic XML sitemap
- Robots.txt optimization
- Geographic targeting (Rwanda/Kigali)
- 20+ optimized keywords
- Mobile-first indexing ready

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16.1](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Radix UI](https://www.radix-ui.com/)** - Accessible components

### Backend
- **[NextAuth.js v5](https://next-auth.js.org/)** - Authentication
- **[Prisma ORM](https://www.prisma.io/)** - Database toolkit
- **[SQLite](https://www.sqlite.org/)** - Development database (PostgreSQL/MySQL for production)
- **[Zod](https://zod.dev/)** - Schema validation
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** - Password hashing

### Tools & Libraries
- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[date-fns](https://date-fns.org/)** - Date utilities
- **[Lucide React](https://lucide.dev/)** - Icon library

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or later
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LMSROP_website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Create `.env.local`:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```
   
   Generate secret:
   ```bash
   openssl rand -base64 32
   ```

4. **Setup database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npm run db:seed  # Optional: seed test data
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

### Test Accounts (After Seeding)

- **Admin**: `admin@rolms.rw` / `admin123`
- **Instructor**: `instructor1@rolms.rw` / `instructor123`
- **Student**: `student1@rolms.rw` / `student123`

### Build for Production

```bash
npm run build
npm start
```

📖 **For detailed setup instructions**, see the Quick Start section above.

---

## 📁 Project Structure

```
rolms/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── courses/            # Course endpoints
│   │   ├── instructor/         # Instructor endpoints
│   │   └── admin/             # Admin endpoints
│   ├── dashboard/              # Student dashboard
│   ├── instructor/             # Instructor features
│   ├── admin/                 # Admin features
│   ├── courses/               # Course pages
│   └── auth/                  # Auth pages (signin/signup)
├── components/                  # React components
│   ├── ui/                    # Reusable UI components
│   ├── courses/               # Course components
│   ├── instructor/            # Instructor components
│   ├── admin/                # Admin components
│   └── layout/               # Layout components
├── lib/                        # Utilities
│   ├── auth.ts               # Auth configuration
│   ├── prisma.ts             # Database client
│   └── utils.ts              # Helper functions
├── prisma/                    # Database
│   ├── schema.prisma         # Database schema
│   ├── seed.ts              # Seed data script
│   └── migrations/          # Database migrations
└── README.md                  # This file
```

---

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
2. **Import to Vercel** - Connect your repository
3. **Configure Environment Variables**:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
4. **Deploy** - Vercel will automatically build and deploy

### Deploy to Netlify

1. **Push to GitHub**
2. **Import to Netlify** - Connect your repository at [app.netlify.com](https://app.netlify.com)
3. **Configure Environment Variables** (see `.env.netlify.example`):
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your Netlify site URL
4. **Deploy** - Netlify will use `netlify.toml` configuration automatically

📖 **For detailed Netlify deployment instructions**, see [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md)

### Database Setup

For production, use PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then run:
```bash
npx prisma migrate deploy
```

**Recommended Database Providers:**
- [Supabase](https://supabase.com) - Free tier available
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Railway](https://railway.app) - Easy PostgreSQL setup

---

## 🎯 Key Features Summary

| Feature | Status | Description |
|---------|--------|-------------|
| Authentication | ✅ | Secure login/registration with NextAuth.js |
| RBAC | ✅ | Student, Instructor, Admin roles |
| Courses | ✅ | Full CRUD operations |
| Lessons | ✅ | Text, Video, Quiz, Assignment types |
| Quizzes | ✅ | Multiple choice, True/False, Short answer |
| Assignments | ✅ | Submission and grading system |
| Progress Tracking | ✅ | Real-time completion tracking |
| Admin Dashboard | ✅ | User and course management |

## 🔮 Future-Ready Architecture

The system is designed to easily integrate:

- 📜 Digital certificates
- 💳 Payment systems
- 🤖 AI tutoring assistant
- 📊 Advanced analytics
- 📱 Mobile application
- 🏆 Competition management

The system is designed with extensibility in mind for future features.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

For issues, questions, or contributions:

- 📖 Check the [documentation](./docs/)
- 🐛 Report issues via GitHub Issues
- 💬 Contact: info@rwandaolympiad.org

---

## 📊 System Requirements Compliance

**Status**: ✅ **95% Complete** - Production Ready

---

## 📝 License

This project is licensed under the MIT License.

---

<div align="center">
  <p>🇷🇼 <strong>Rwanda Olympiad LMS (ROLMS)</strong></p>
  <p>Empowering Rwanda's Future Innovators Through Excellence in STEM Education</p>
  <p><strong>© 2026 Rwanda Olympiad Foundation. All rights reserved.</strong></p>
</div>
