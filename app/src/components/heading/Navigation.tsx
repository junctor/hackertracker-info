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
import useSWR from "swr";
import { fetcher } from "@/lib/utils/misc";

export default function Navigation() {
  const { data: menuData } = useSWR<HTMenu[], Error>("/ht/menus.json", fetcher);

  const orgs = (
    menuData?.[menuData?.length - 1]?.items?.filter(
      (m) => m.function === "organizations"
    ) ?? []
  )
    .sort((a, b) => a.sort_order - b.sort_order)
    .filter((o) => o.applied_tag_ids.length > 0 && o.title_text !== "Vendors")
    .map((o) => {
      return {
        title: o.title_text,
        link: `/orgs?id=${o.applied_tag_ids[0]}`,
      };
    });

  console.log(menuData?.[menuData?.length - 1]?.items ?? []);

  const pages = [
    { title: "Announcements", link: "/news" },
    { title: "People", link: "/speakers" },
    { title: "Maps", link: "/maps" },
    { title: "Apps", link: "/apps" },
    // { title: "Merch", link: "/merch" },
    // { title: "Locations", link: "/locations" },
    ...orgs,
  ];

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
