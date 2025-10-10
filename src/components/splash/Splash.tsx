import React from "react";
import Countdown from "@/components/countdown/Countdown";
import Image from "next/image";
import dcbLogo from "../../../public/images/dc-bahrain-logo.webp";
import Link from "next/link";
import { SITE_MENU } from "@/lib/menu";
import { CalendarIcon } from "lucide-react";
import { MobileIcon } from "@radix-ui/react-icons";
import { TARGET_DATE_MS } from "@/lib/timer";

const navMenu = [
  {
    sort_order: 0,
    title: "Schedule",
    href: "/schedule",
    description: "View the full schedule of talks and events.",
    icon: CalendarIcon,
  },
  ...SITE_MENU,
  {
    sort_order: 19,
    title: "Apps",
    href: "/apps",
    description: "View the available apps.",
    icon: MobileIcon,
  },
];

export default function Splash() {
  return (
    <main className="py-16 max-w-6xl mx-auto px-4">
      {/* Hero */}
      <div className="text-center space-y-4">
        <Image src={dcbLogo} alt="DEF CON Bahrain 2025" priority />
        <Countdown />
      </div>

      {TARGET_DATE_MS < Date.now().valueOf() && <Countdown />}

      {/* Menu */}
      <section className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {navMenu.map((item) => {
          const Icon = item.icon;
          const isExternal = item.href.startsWith("http");

          return isExternal ? (
            <a
              key={item.sort_order}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.title}
              className="flex flex-col items-center justify-center p-5 bg-gray-800 rounded-2xl shadow-md hover:scale-105 hover:shadow-lg transition"
            >
              <Icon className="h-6 w-6 mb-2 text-gray-200" />
              <span className="text-sm font-semibold text-gray-100">
                {item.title}
              </span>
            </a>
          ) : (
            <Link
              key={item.sort_order}
              href={item.href}
              aria-label={item.title}
              className="flex flex-col items-center justify-center p-5 bg-gray-800 rounded-2xl shadow-md hover:scale-105 hover:shadow-lg transition"
            >
              <Icon className="h-6 w-6 mb-2 text-gray-200" />
              <span className="text-sm font-semibold text-gray-100">
                {item.title}
              </span>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
