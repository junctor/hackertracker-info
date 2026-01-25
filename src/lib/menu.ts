/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArchiveBoxIcon,
  BoltIcon,
  BookmarkIcon,
  CubeIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  ListBulletIcon,
  MegaphoneIcon,
  SparklesIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

export function getSiteMenu(configSlug: string) {
  return [
    {
      sort_order: 1,
      title: "readme.nfo",
      href: `/${configSlug}/readme.nfo`,
      description:
        "A collection of information related to DEF CON Singapore 2026.",
      icon: InformationCircleIcon,
    },
    // {
    //   sort_order: 2,
    //   title: "Content",
    //   href: `/${configSlug}/contents`,
    //   description:
    //     "Browse all talks, workshops, and presentations at DEF CON Singapore 2026.",
    //   icon: ListBulletIcon,
    // },
    // {
    //   sort_order: 3,
    //   title: "Bookmarks",
    //   href: `/${configSlug}/bookmarks`,
    //   description: "Save your favorite talks, workshops, and presentations.",
    //   icon: BookmarkIcon,
    // },
    // {
    //   sort_order: 4,
    //   title: "Speakers",
    //   href: `/${configSlug}/people`,
    //   description:
    //     "Meet DEF CON Singapore 2026 speakers and explore their session details.",
    //   icon: UserIcon,
    // },
    // {
    //   sort_order: 6,
    //   title: "Maps",
    //   href: `/${configSlug}/maps`,
    //   description: "View detailed venue layouts and floor plans.",
    //   icon: GlobeAltIcon,
    // },
    {
      sort_order: 10,
      title: "Announcements",
      href: `/${configSlug}/announcements`,
      description:
        "Get real-time updates and important news during the conference.",
      icon: MegaphoneIcon,
    },
    {
      sort_order: 12,
      title: "Villages",
      href: `/${configSlug}/villages`,
      description:
        "Explore hands-on villages for hacking, learning, and collaboration.",
      icon: ArchiveBoxIcon,
    },
    {
      sort_order: 14,
      title: "Communities",
      href: `/${configSlug}/communities`,
      description:
        "Connect with special-interest groups and meetups at DEF CON Singapore 2026.",
      icon: UsersIcon,
    },
    {
      sort_order: 16,
      title: "Contests",
      href: `/${configSlug}/contests`,
      description:
        "Test your skills in lockpicking, CTFs, and more challenges.",
      icon: BoltIcon,
    },
    // {
    //   sort_order: 18,
    //   title: "Exhibitors",
    //   href: `/${configSlug}/exhibitors`,
    //   description:
    //     "Discover exhibitors showcasing cutting-edge security solutions.",
    //   icon: SparklesIcon,
    // },
    // {
    //   sort_order: 20,
    //   title: "Vendors",
    //   href: `/${configSlug}/vendors`,
    //   description: "Browse official vendors offering gear, swag, and services.",
    //   icon: CubeIcon,
    // },
  ].sort((a, b) => a.sort_order - b.sort_order);
}
