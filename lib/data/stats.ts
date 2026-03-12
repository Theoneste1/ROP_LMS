import { GraduationCap, Trophy, Users, Sparkles } from "lucide-react";

export const universities = [
    { name: "MIT", logo: "/images/universities/MIT.png" },
    { name: "Harvard", logo: "/images/universities/havard.jpeg" },
    { name: "Yale", logo: "/images/universities/yale.png" },
    {
      name: "African Leadership University",
      logo: "/images/universities/ALU.png",
    },
    {
      name: "Union University",
      logo: "/images/universities/Unio-university.png",
    },
    { name: "Caltech", logo: "/images/universities/Caltech.png" },
    {
      name: "Rice University",
      logo: "/images/universities/Rice-University.png",
    },
    { name: "Cambridge", logo: "/images/universities/Cambridge.png" },
    {
      name: "Carnegie Mellon",
      logo: "/images/universities/Carnegie-Mellon.png",
    },
    { name: "Global Health", logo: "/images/universities/Global-Health.jpeg" },
    {
      name: "University of Rwanda",
      logo: "/images/universities/University-of-Rwanda.png",
    },
  ];

  export const stats = [
    {
      icon: GraduationCap,
      value: "500+",
      label: "Students Trained",
      color: "text-[#0891B2]",
    },
    {
      icon: Trophy,
      value: "50+",
      label: "International Medals",
      color: "text-[#FBBF24]",
    },
    {
      icon: Users,
      value: "100+",
      label: "Alumni Network",
      color: "text-[#0891B2]",
    },
    {
      icon: Sparkles,
      value: "15+",
      label: "Countries Represented",
      color: "text-[#FBBF24]",
    },
  ];
