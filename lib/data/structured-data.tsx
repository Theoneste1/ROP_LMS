export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Rwanda Olympiad Foundation",
    alternateName: "ROF Rwanda",
    url: "https://rwandaolympiad.org",
    logo: "https://rwandaolympiad.org/images/rop-logo-full.png",
    description:
      "The national umbrella organization coordinating Mathematics, Physics, Informatics, and Artificial Intelligence Olympiads in Rwanda",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kigali",
      addressCountry: "Rwanda",
      addressRegion: "Kigali",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "-1.9441",
      longitude: "30.0619",
    },
    sameAs: [
      "https://twitter.com/RwandaOlympiad",
      "https://www.facebook.com/RwandaOlympiad",
      "https://www.linkedin.com/company/rwanda-mathematics-olympiad/?viewAsMember=true",
      "https://www.instagram.com/rwandaolympiad",
    ],
    foundingDate: "2015",
    areaServed: {
      "@type": "Country",
      name: "Rwanda",
    },
    knowsAbout: [
      "Mathematics Olympiad",
      "Physics Olympiad",
      "Informatics Olympiad",
      "Artificial Intelligence",
      "STEM Education",
      "International Competitions",
    ],
    memberOf: {
      "@type": "Organization",
      name: "International Mathematical Olympiad",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Rwanda Olympiad Foundation",
    url: "https://rwandaolympiad.org",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://rwandaolympiad.org/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const educationalEventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": "https://rwandaolympiad.org/#olympiad-events",
    name: "Rwanda Olympiad Competitions",
    description:
      "Annual Mathematics, Physics, Computing, and AI Olympiad competitions in Rwanda",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "Various locations across Rwanda",
      address: {
        "@type": "PostalAddress",
        addressCountry: "Rwanda",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Rwanda Olympiad Foundation",
      url: "https://rwandaolympiad.org",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the Rwanda Olympiad Foundation (ROF)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Rwanda Olympiad Foundation is the national umbrella organization that coordinates and organizes Mathematics, Physics, Informatics, and Artificial Intelligence Olympiads in Rwanda. We identify, train, and support talented students to compete at national and international competitions.",
        },
      },
      {
        "@type": "Question",
        name: "Who can participate in ROF programs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ROF programs are open to all Rwandan students from secondary schools across the country. Students are selected through a series of competitive examinations and assessments in their respective disciplines.",
        },
      },
      {
        "@type": "Question",
        name: "What are the benefits of participating in Olympiad programs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Olympiad participation enhances critical thinking, problem-solving skills, and academic excellence. Our alumni have gained admission to prestigious universities worldwide including MIT, Harvard, Yale, Cambridge, and Carnegie Mellon.",
        },
      },
      {
        "@type": "Question",
        name: "How do I register for an Olympiad competition?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Registration processes vary by discipline. Visit the respective program websites (Mathematics, Physics, or Computing) for specific registration details and deadlines. Typically, registrations open several months before competitions.",
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://rwandaolympiad.org",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "FAQ",
        item: "https://rwandaolympiad.org/#faq",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(educationalEventSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
