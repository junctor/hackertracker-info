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
    .filter((o) => o.applied_tag_ids.length > 0)
    .map((o) => {
      return {
        title: o.title_text,
        link: `/orgs?id=${o.applied_tag_ids[0]}`,
      };
    });

  const displayDocs = (
    menuData?.[menuData?.length - 1]?.items?.filter(
      (m) => m.function === "document"
    ) ?? []
  )
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((d) => {
      return {
        title: d.title_text,
        link: `/doc?id=${d.document_id}`,
      };
    });

  const pages = [
    { title: "Announcements", link: "/news" },
    { title: "People", link: "/speakers" },
    { title: "On Now & Upcoming", link: "/upcoming" },
    { title: "Maps", link: "/maps" },
    { title: "Apps", link: "/apps" },
    { title: "Documents", link: "/docs" },

    // { title: "Merch", link: "/merch" },
    // { title: "Locations", link: "/locations" },
    ...displayDocs,
    ...orgs,
  ];

  return (
    <div className="ml-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid grid-cols-2 w-80">
                {pages.map((p) => (
                  <li key={p.title}>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      href={p.link}
                    >
                      {p.title}
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              href="/events"
            >
              Schedule
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="md:block hidden">
            <NavigationMenuTrigger>Mobile</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid grid-cols-2 w-80">
                <li>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    href="https://play.google.com/store/apps/details?id=com.shortstack.hackertracker&hl=en_US"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Android
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    href="https://itunes.apple.com/us/app/hackertracker/id1021141595?mt=8"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    iOS
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
