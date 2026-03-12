import { Users } from "lucide-react";

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  achievements?: string[];
}

export interface TeamCategory {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  members: TeamMember[];
}

export const teamCategories: TeamCategory[] = [
  {
    title: "Our Team",
    description: "Meet the dedicated team driving the vision and mission of the Rwanda Olympiad Foundation",
    icon: Users,
    members: [
      {
        name: "Obed Nsanzimfura",
        role: "Program Manager",
        bio: "Program Manager of the Rwanda Olympiad Foundation with interests in Talent, Data, and Tech. Passionate about STEM education and committed to nurturing Rwanda's brightest minds through the Olympiad Foundation.",
        image: "/images/obed-nsanzimfura.png",
        linkedin: "https://www.linkedin.com/in/obed-nsanzimfura"
      },
      {
        name: "Vanessa Sambwe",
        role: "Program Manager Associate",
        bio: "Dedicated to advancing STEM education and empowering students to excel in international competitions.",
        image: "/images/vanessa-sambwe.png",
        linkedin: "https://www.linkedin.com/in/vanessa-s-irakoze-1a7283148/"
      },
      {
        name: "Theoneste Nsanzabarinda",
        role: "Tech & Communication Lead",
        bio: "Responsible for tech and communication at the Rwanda Olympiad Foundation. Committed to developing Rwanda's future innovators through excellence in Mathematics, Physics, and Computing education.",
        image: "/images/theoneste-nsanzabarinda.png",
        linkedin: "https://www.linkedin.com/in/theoneste-nsanzabarinda-458540157/"
      }
    ]
  }
];
