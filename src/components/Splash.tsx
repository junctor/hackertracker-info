import React from "react";
import Countdown from "@/components/countdown/Countdown";
import Image from "next/image";
import dc33Logo from "../../public/images/33-calls-header-2.webp";
import {
  PersonIcon,
  GlobeIcon,
  FileTextIcon,
  SpeakerLoudIcon,
  BackpackIcon,
  GroupIcon,
  ListBulletIcon,
  MobileIcon,
  CalendarIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

const RAW_MENU = [
  { sort_order: 1, title: "Schedule", href: "/schedule", icon: CalendarIcon },
  { sort_order: 2, title: "Content", href: "/contents", icon: ListBulletIcon },
  { sort_order: 6, title: "People", href: "/people", icon: PersonIcon },
  { sort_order: 8, title: "Maps", href: "/maps", icon: GlobeIcon },
  {
    sort_order: 10,
    title: "Code of Conduct",
    href: "/code-of-conduct",
    icon: FileTextIcon,
  },
  {
    sort_order: 12,
    title: "Announcements",
    href: "/announcements",
    icon: SpeakerLoudIcon,
  },
  { sort_order: 14, title: "Villages", href: "/villages", icon: BackpackIcon },
  {
    sort_order: 16,
    title: "Communities",
    href: "/communities",
    icon: GroupIcon,
  },
  {
    sort_order: 18,
    title: "Contests",
    href: "/contests",
    icon: LightningBoltIcon,
  },
  { sort_order: 19, title: "Apps", href: "/apps", icon: MobileIcon },
];

export default function Splash() {
  return (
    <main className="py-16 max-w-6xl mx-auto px-4">
      {/* Hero */}
      <div className="text-center space-y-4">
        <Image
          src={dc33Logo}
          alt="DEF CON 33 | Aug 6–9 2025 in Las Vegas"
          priority
        />
        <Countdown />
      </div>

      {/* Menu */}
      <section className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {RAW_MENU.sort((a, b) => a.sort_order - b.sort_order).map((item) => {
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
