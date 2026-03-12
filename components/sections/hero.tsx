import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section
      id="home"
      aria-label="ROLMS Hero Section"
      className="relative min-h-[90vh] flex items-center justify-center text-white overflow-hidden bg-gradient-to-br from-[#0C1E33] via-[#0891B2] to-[#065F46]"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FBBF24]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#0891B2]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#065F46]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <Sparkles className="h-4 w-4 text-[#FBBF24]" />
          <span className="text-sm font-medium">Premium Learning Platform</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
          Master Mathematics Olympiad
          <br />
          <span className="bg-gradient-to-r from-[#FBBF24] via-[#FCD34D] to-[#FBBF24] bg-clip-text text-transparent">
            With Expert Training
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg md:text-xl leading-relaxed text-gray-200 max-w-3xl mx-auto text-pretty">
          Rwanda Olympiad LMS - Your comprehensive platform for structured learning,
          <br className="hidden md:block" />
          interactive quizzes, and progress tracking. Excel in mathematics competitions.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-[#0891B2] to-[#0C1E33] hover:from-[#0891B2]/90 hover:to-[#0C1E33]/90 text-white text-lg px-8 py-6 shadow-lg shadow-[#0891B2]/50 hover:shadow-xl hover:shadow-[#0891B2]/50 transition-all duration-300"
            asChild
          >
            <Link href="/courses">
              Browse Courses
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-6 bg-white/5 transition-all duration-300"
            asChild
          >
            <Link href="/auth/signup">Get Started Free</Link>
          </Button>
        </div>

        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
            <BookOpen className="h-8 w-8 text-[#FBBF24] mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-1">Structured Courses</h3>
            <p className="text-sm text-gray-300">Step-by-step learning paths</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
            <Users className="h-8 w-8 text-[#0891B2] mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-1">Expert Instructors</h3>
            <p className="text-sm text-gray-300">Learn from the best</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
            <TrendingUp className="h-8 w-8 text-[#065F46] mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-1">Track Progress</h3>
            <p className="text-sm text-gray-300">Monitor your growth</p>
          </div>
        </div>
      </div>
    </section>
  );
}
