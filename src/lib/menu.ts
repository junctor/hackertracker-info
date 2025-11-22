import {
  PersonIcon,
  BackpackIcon,
  GroupIcon,
  ListBulletIcon,
  InfoCircledIcon,
  BookmarkIcon,
} from "@radix-ui/react-icons";

export const SITE_MENU = [
  {
    sort_order: 1,
    title: "readme.nfo",
    href: "/readme.nfo",
    description:
      "A collection of information related to DEF CON Singapore 2025.",
    icon: InfoCircledIcon,
  },
  {
    sort_order: 2,
    title: "Content",
    href: "/contents",
    description:
      "Browse all talks, workshops, and presentations at DEF CON Singapore 2025.",
    icon: ListBulletIcon,
  },
  {
    sort_order: 3,
    title: "Bookmarks",
    href: "/bookmarks",
    description: "Save your favorite talks, workshops, and presentations.",
    icon: BookmarkIcon,
  },
  {
    sort_order: 4,
    title: "Speakers",
    href: "/people",
    description:
      "Meet DEF CON Singapore 2025 speakers and explore their session details.",
    icon: PersonIcon,
  },
  {
    sort_order: 12,
    title: "Villages",
    href: "/villages",
    description:
      "Explore hands-on villages for hacking, learning, and collaboration.",
    icon: BackpackIcon,
  },
  {
    sort_order: 13,
    title: "Departments",
    href: "/departments",
    description: "Discover various departments at DEF CON Singapore 2025.",
    icon: GroupIcon,
  },
].sort((a, b) => a.sort_order - b.sort_order);
