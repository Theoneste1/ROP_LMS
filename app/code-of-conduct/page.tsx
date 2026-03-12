import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  Shield,
  Users,
  Heart,
  BookOpen,
  Award,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code of Conduct | Rwanda Olympiad Foundation",
  description:
    "Our commitment to creating a safe, inclusive, and respectful environment for all members of the Rwanda Olympiad Foundation community.",
};

export default function CodeOfConduct() {
  const sections = [
    {
      icon: Heart,
      title: "Respect and Integrity",
      content: [
        "Treat all participants, coaches, volunteers, and staff with respect and dignity",
        "Embrace diversity and promote an inclusive environment for all",
        "Uphold academic integrity in all competitions and training sessions",
        "Practice honesty and transparency in all interactions",
      ],
    },
    {
      icon: Users,
      title: "Collaboration and Sportsmanship",
      content: [
        "Support fellow participants and celebrate their achievements",
        "Share knowledge and resources to help others grow",
        "Accept both victory and defeat with grace and humility",
        "Compete fairly without cheating or taking unfair advantages",
      ],
    },
    {
      icon: BookOpen,
      title: "Learning and Development",
      content: [
        "Maintain a commitment to continuous learning and improvement",
        "Attend scheduled training sessions and competitions on time",
        "Actively participate in discussions and collaborative activities",
        "Ask questions and seek help when needed",
      ],
    },
    {
      icon: Shield,
      title: "Safety and Well-being",
      content: [
        "Create and maintain a safe environment for all participants",
        "Report any concerns about safety or inappropriate behavior immediately",
        "Follow all guidelines and protocols during events and activities",
        "Support the mental and emotional well-being of all community members",
      ],
    },
    {
      icon: Award,
      title: "Responsibility and Accountability",
      content: [
        "Take responsibility for your actions and their consequences",
        "Follow rules and regulations set by ROF and competition organizers",
        "Represent Rwanda and ROF with pride and professionalism",
        "Use resources and facilities responsibly",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0C1E33] via-[#0C1E33] to-[#065F46] text-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 sm:w-20 sm:h-20 text-[#FBBF24] mx-auto mb-6" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Code of <span className="text-[#FBBF24]">Conduct</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Our commitment to creating a safe, inclusive, and respectful
            environment for all members of the Rwanda Olympiad Foundation community
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0891B2]/5 border-l-4 border-[#0891B2] rounded-r-lg p-6 mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0C1E33] mb-4">
              Our Commitment
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The Rwanda Olympiad Foundation (ROF) is dedicated to fostering a
              positive, supportive, and inclusive environment where all
              participants can thrive. This Code of Conduct outlines the
              expectations and standards for behavior that all members of our
              community must uphold.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-8 flex sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:gap-12">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 sm:p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-[#0891B2]/10 p-3 rounded-lg">
                    <section.icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#0891B2]" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#0C1E33]">
                      {section.title}
                    </h3>
                  </div>
                </div>
                <ul className="space-y-3 ml-0 sm:ml-16">
                  {section.content.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-[#0891B2] mt-1 text-lg">•</span>
                      <span className="text-gray-700 text-sm sm:text-base leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Violations and Reporting */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-6">
              <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0C1E33] mb-4">
                  Violations and Reporting
                </h3>
                <div className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
                  <p>
                    Violations of this Code of Conduct will not be tolerated.
                    Depending on the severity, consequences may include
                    warnings, temporary suspension, or permanent removal from
                    ROF programs and activities.
                  </p>
                  <p>
                    If you witness or experience behavior that violates this
                    Code of Conduct, please report it immediately to:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="text-[#0891B2]">•</span>
                      <span>Your program coordinator or coach</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#0891B2]">•</span>
                      <span>ROF leadership team</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#0891B2]">•</span>
                      <span>
                        Email:{" "}
                        <a
                          href="mailto:conduct@rwandaolympiad.org"
                          className="text-[#0891B2] hover:underline"
                        >
                          conduct@rwandaolympiad.org
                        </a>
                      </span>
                    </li>
                  </ul>
                  <p className="mt-4">
                    All reports will be handled confidentially and investigated
                    promptly and fairly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Acknowledgment */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-[#0891B2]/10 to-[#FBBF24]/10 rounded-xl p-8 sm:p-12">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0C1E33] mb-4">
              Acknowledgment
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              By participating in Rwanda Olympiad Foundation activities, you agree
              to abide by this Code of Conduct and contribute to creating a
              positive and supportive community for all.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#0891B2] hover:bg-[#0891B2]/90 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
