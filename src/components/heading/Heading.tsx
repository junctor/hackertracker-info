"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  PersonIcon,
  GlobeIcon,
  FileTextIcon,
  SpeakerLoudIcon,
  BackpackIcon,
  GroupIcon,
  ListBulletIcon,
  MobileIcon,
  RocketIcon,
  GitHubLogoIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";
import GlobalSearch from "./GlobalSearch";
import localFont from "next/font/local";

const RAW_MENU = [
  {
    sort_order: 2,
    title: "Content",
    href: "/content",
    description: "Explore all content for DEF CON 33.",
    icon: ListBulletIcon,
  },
  {
    sort_order: 6,
    title: "People",
    href: "/people",
    description: "Browse bios and sessions for all DEF CON 33 participants.",
    icon: PersonIcon,
  },
  {
    sort_order: 8,
    title: "Maps",
    href: "/maps",
    description: "Navigate DEF CON with venue and floor maps.",
    icon: GlobeIcon,
  },
  {
    sort_order: 10,
    title: "Code of Conduct",
    href: "/code-of-conduct",
    description: "Community expectations and event rules.",
    icon: FileTextIcon,
  },
  {
    sort_order: 12,
    title: "Announcements",
    href: "/announcements",
    description: "Live updates and important news during the event.",
    icon: SpeakerLoudIcon,
  },
  {
    sort_order: 14,
    title: "Villages",
    href: "/villages",
    description: "Hands-on areas for learning, building, and hacking.",
    icon: BackpackIcon,
  },
  {
    sort_order: 16,
    title: "Communities",
    href: "/communities",
    description: "Meetups and informal groups at DEF CON.",
    icon: GroupIcon,
  },
  {
    sort_order: 18,
    title: "Contests",
    href: "/contests",
    description: "Compete in challenges from lockpicking to CTFs.",
    icon: LightningBoltIcon,
  },
];

// Pre-sort once
const navMenuList = RAW_MENU.slice().sort(
  (a, b) => a.sort_order - b.sort_order
);

const museoFont = localFont({
  src: "../../../public/fonts/Museo700-Regular.woff2",
  display: "swap",
  variable: "--font-museo",
});

export default function Heading() {
  return (
    <header className="sticky top-0 z-50 bg-background text-white px-5 py-3 border-b border-border">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Logo + Primary Nav */}
        <div className="flex items-center space-x-6">
          <Link href="https://defcon.org/html/defcon-33/dc-33-index.html">
            <h1
              className={`${museoFont.className} text-2xl md:text-3xl font-bold`}
            >
              <span className="block md:hidden">DC33</span>
              <span className="hidden md:block">DEF CON 33</span>
            </h1>
          </Link>

          <NavigationMenu>
            <NavigationMenuList className="flex items-center space-x-4">
              {/* Schedule Link */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/schedule">Schedule</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Explore Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-1">
                  <RocketIcon className="w-4 h-4 flex-shrink-0" />
                  <span>Explore</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-56 md:w-80 gap-4 p-2">
                    {navMenuList.map(
                      ({ title, href, description, icon: Icon }) => (
                        <li key={title}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={href}
                              className="flex flex-col gap-1 px-2 py-1 hover:bg-accent rounded-md"
                            >
                              <div className="flex items-center gap-2">
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                <span className="font-medium">{title}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      )
                    )}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-2">
          <GlobalSearch />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Mobile Apps"
            onClick={() =>
              window.open("/apps", "_blank", "noopener,noreferrer")
            }
          >
            <MobileIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="View on GitHub"
            onClick={() =>
              window.open(
                "https://github.com/junctor/hackertracker-info",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            <GitHubLogoIcon />
          </Button>
        </div>
      </div>
      <Separator className="absolute bottom-0 left-0 right-0" />
    </header>
  );
}
