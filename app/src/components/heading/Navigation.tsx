"use client";

import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import Link from "next/link";
import { tagsOrgs } from "@/lib/utils/orgs";

const orgs = Array.from(tagsOrgs)
  .sort(([, a], [, b]) => a.localeCompare(b))
  .map((o) => {
    return {
      title: o[1],
      link: `/orgs?id=${o[0]}`,
    };
  });

const pages = [
  // { title: "Schedule", link: "/events" },
  { title: "Speakers", link: "/speakers" },
  { title: "News", link: "/news" },
  { title: "Apps", link: "/apps" },
  // { title: "Maps", link: "/maps" },
  // { title: "Merch", link: "/merch" },
  // { title: "Locations", link: "/locations" },
  ...orgs,
].sort((a, b) => a.title.localeCompare(b.title));

export default function Navigation() {
  return (
    <div className="ml-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid grid-cols-2 w-72">
                {pages.map((p) => (
                  <li key={p.title}>
                    <Link href={p.link}>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        {p.title}
                      </NavigationMenuLink>
                    </Link>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/events" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Schedule
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="md:block hidden">
            <NavigationMenuTrigger>Mobile</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid grid-cols-2 w-72">
                <li>
                  <Link
                    href="https://play.google.com/store/apps/details?id=com.shortstack.hackertracker&hl=en_US"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Android
                    </NavigationMenuLink>
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://itunes.apple.com/us/app/hackertracker/id1021141595?mt=8"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      iOS
                    </NavigationMenuLink>
                  </Link>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
