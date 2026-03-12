import { Hero } from "@/components/sections/hero";
import { FAQ } from "@/components/sections/faq";

import { StructuredData } from "@/lib/data/structured-data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Rwanda Olympiad LMS",
  description:
    "Rwanda Olympiad LMS - A complete Learning Management System for Mathematics Olympiad training.",
  keywords: [
    "Rwanda Olympiad LMS",
    "ROLMS",
    "Mathematics Olympiad Rwanda",
    "LMS Rwanda",
    "Online Learning Rwanda",
  ],
  openGraph: {
    title: "Rwanda Olympiad LMS | Home",
    description:
      "Rwanda Olympiad LMS - A complete Learning Management System for Mathematics Olympiad training.",
    url: "https://rwandaolympiad.org",
    type: "website",
  },
  alternates: {
    canonical: "https://rwandaolympiad.org",
  },
};

export default function Home() {
  return (
    <>
      <StructuredData />
      <main className="min-h-screen">
        <Hero />
        <FAQ />
      </main>
    </>
  );
}
