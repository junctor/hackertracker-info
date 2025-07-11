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
import { MobileIcon, RocketIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import GlobalSearch from "./GlobalSearch";
import localFont from "next/font/local";
import { SITE_MENU } from "@/lib/menu";

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
          <Link href="/">
            <h1
              className={`${museoFont.className} text-2xl md:text-3xl font-bold logo`}
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
                  <span className="hidden md:block">Explore</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-56 md:w-80 gap-4 p-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
                    {SITE_MENU.map(
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
                              <p className="text-sm text-muted-foreground hidden sm:block">
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
          <GlobalSearch />
        </div>
      </div>
      <Separator className="absolute bottom-0 left-0 right-0" />
    </header>
  );
}
