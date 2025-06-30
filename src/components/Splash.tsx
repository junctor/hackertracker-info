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
  GitHubLogoIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";

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
  {
    sort_order: 20,
    title: "GitHub",
    href: "https://github.com/junctor/hackertracker-info",
    icon: GitHubLogoIcon,
  },
];

export default function Splash() {
  return (
    <div className="my-14">
      {/* Logo */}
      <div className="flex justify-center mt-5">
        <Image src={dc33Logo} alt="DEF CON 33 Logo" priority />
      </div>

      {/* Countdown */}
      <div className="mt-6 text-center">
        <Countdown />
      </div>

      {/* Menu Grid */}
      <div className="mt-12 max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {RAW_MENU.sort((a, b) => a.sort_order - b.sort_order).map((item) => {
          const Icon = item.icon;
          const isExternal = item.href.startsWith("http");
          return (
            <a
              key={item.sort_order}
              href={item.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="bg-gray-800 hover:bg-gray-700 active:scale-[.98] transition-all p-4 sm:p-5 rounded-xl shadow-md flex flex-col items-center text-center"
            >
              <Icon className="h-3 w-3 sm:h-5 sm:w-5 mb-2 text-gray-200" />
              <h3 className="text-xs sm:text-sm font-semibold text-gray-100">
                {item.title}
              </h3>
            </a>
          );
        })}
      </div>
    </div>
  );
}
