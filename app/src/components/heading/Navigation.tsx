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

const orgs = Array.from(tagsOrgs).sort(([, a], [, b]) => a.localeCompare(b));

export default function Navigation() {
  return (
    <div className="ml-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/events" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Schedule
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Organizations</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid grid-cols-2 w-56">
                {orgs.map((o) => (
                  <li key={o[1]}>
                    <Link href={`/orgs?id=${o[0]}`}>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        {o[1]}
                      </NavigationMenuLink>
                    </Link>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className="md:block hidden">
            <NavigationMenuTrigger>Mobile</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid grid-cols-2 w-56">
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
