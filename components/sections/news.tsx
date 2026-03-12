import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function News() {
  const newsItems = [
    {
      title: "Team Rwanda Excels at PAIO 2025",
      date: "March 15, 2025",
      description:
        "Our informatics team brought home 2 bronze medals and 3 honorable mentions from the Pan-African Informatics Olympiad.",
      category: "Achievement",
    },
    {
      title: "National Training Camp Registration Open",
      date: "March 10, 2025",
      description:
        "Applications are now open for the 2025 Summer Training Camp. Join us for intensive preparation across all disciplines.",
      category: "Announcement",
    },
    {
      title: "New Partnership with Ministry of Education",
      date: "March 5, 2025",
      description:
        "ROF signs MoU with Ministry of Education to enhance AI Olympiad training and provide mentorship opportunities.",
      category: "Partnership",
    },
  ];

  return (
    <section id="news" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-[#0891B2]">
            News & Updates
          </h2>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#0C1E33] sm:text-3xl">
            Latest from ROF
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 text-pretty">
            Stay updated with our latest achievements, announcements, and
            stories from Rwanda's Olympiad community.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {newsItems.map((item) => (
            <Card
              key={item.title}
              className="border-none shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>{item.date}</span>
                </div>
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[#0891B2]/10 text-[#0891B2] w-fit mb-2">
                  {item.category}
                </span>
                <CardTitle className="text-xl text-[#0C1E33]">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="ghost"
                  className="text-[#0891B2] hover:text-[#0891B2]/80 hover:bg-[#0891B2]/10 p-0"
                >
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-[#0891B2] text-[#0891B2] hover:bg-[#0891B2]/10 bg-transparent"
          >
            View All News
          </Button>
        </div>
      </div>
    </section>
  );
}
