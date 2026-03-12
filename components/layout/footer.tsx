import { social } from "@/lib/data/socials";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const navigation = {
    resources: [
      { name: "FAQ", href: "#faq" },
    ],
    legal: [{ name: "Code of Conduct", href: "/code-of-conduct" }],
  };

  return (
    <footer className="bg-[#0C1E33] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/rof-logo.svg"
                alt="ROLMS Logo"
                width={200}
                height={70}
                className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[220px]"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Rwanda Olympiad LMS - A complete Learning Management System for Mathematics Olympiad training.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#FBBF24] mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#FBBF24] mb-4">Legal</h3>
            <ul className="space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Rwanda Olympiad LMS. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            {social.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-400 text-center mt-4">
          Built with love by ROLMS Tech Team
        </p>
      </div>
    </footer>
  );
}
