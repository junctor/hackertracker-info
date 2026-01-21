/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  PersonIcon,
  GlobeIcon,
  SpeakerLoudIcon,
  BackpackIcon,
  GroupIcon,
  ListBulletIcon,
  LightningBoltIcon,
  CubeIcon,
  MagicWandIcon,
  InfoCircledIcon,
  BookmarkIcon,
} from "@radix-ui/react-icons";

export function getSiteMenu(configSlug: string) {
  return [
    {
      sort_order: 1,
      title: "readme.nfo",
      href: `/${configSlug}/readme.nfo`,
      description:
        "A collection of information related to DEF CON Singapore 2026.",
      icon: InfoCircledIcon,
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
    //   icon: PersonIcon,
    // },
    // {
    //   sort_order: 6,
    //   title: "Maps",
    //   href: `/${configSlug}/maps`,
    //   description: "View detailed venue layouts and floor plans.",
    //   icon: GlobeIcon,
    // },
    {
      sort_order: 10,
      title: "Announcements",
      href: `/${configSlug}/announcements`,
      description:
        "Get real-time updates and important news during the conference.",
      icon: SpeakerLoudIcon,
    },
    {
      sort_order: 12,
      title: "Villages",
      href: `/${configSlug}/villages`,
      description:
        "Explore hands-on villages for hacking, learning, and collaboration.",
      icon: BackpackIcon,
    },
    {
      sort_order: 14,
      title: "Communities",
      href: `/${configSlug}/communities`,
      description:
        "Connect with special-interest groups and meetups at DEF CON Singapore 2026.",
      icon: GroupIcon,
    },
    {
      sort_order: 16,
      title: "Contests",
      href: `/${configSlug}/contests`,
      description:
        "Test your skills in lockpicking, CTFs, and more challenges.",
      icon: LightningBoltIcon,
    },
    // {
    //   sort_order: 18,
    //   title: "Exhibitors",
    //   href: `/${configSlug}/exhibitors`,
    //   description:
    //     "Discover exhibitors showcasing cutting-edge security solutions.",
    //   icon: MagicWandIcon,
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
