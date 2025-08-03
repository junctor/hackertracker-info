import {
  PersonIcon,
  GlobeIcon,
  FileTextIcon,
  SpeakerLoudIcon,
  BackpackIcon,
  GroupIcon,
  ListBulletIcon,
  LightningBoltIcon,
  CubeIcon,
  MagicWandIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";

export const SITE_MENU = [
  {
    sort_order: 2,
    title: "Content",
    href: "/contents",
    description:
      "Browse all talks, workshops, and presentations at DEF CON 33.",
    icon: ListBulletIcon,
  },
  {
    sort_order: 1,
    title: "readme.nfo",
    href: "/readme.nfo",
    description: "A collection of information related to DEF CON.",
    icon: InfoCircledIcon,
  },
  {
    sort_order: 4,
    title: "Speakers",
    href: "/people",
    description: "Meet DEF CON 33 speakers and explore their session details.",
    icon: PersonIcon,
  },
  {
    sort_order: 6,
    title: "Maps",
    href: "/maps",
    description: "View detailed venue layouts and floor plans.",
    icon: GlobeIcon,
  },
  {
    sort_order: 8,
    title: "Code of Conduct",
    href: "/code-of-conduct",
    description: "Read DEF CON’s community guidelines and event policies.",
    icon: FileTextIcon,
  },
  {
    sort_order: 10,
    title: "Announcements",
    href: "/announcements",
    description:
      "Get real-time updates and important news during the conference.",
    icon: SpeakerLoudIcon,
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
    sort_order: 14,
    title: "Communities",
    href: "/communities",
    description: "Connect with special-interest groups and meetups at DEF CON.",
    icon: GroupIcon,
  },
  {
    sort_order: 16,
    title: "Contests",
    href: "/contests",
    description: "Test your skills in lockpicking, CTFs, and more challenges.",
    icon: LightningBoltIcon,
  },
  {
    sort_order: 18,
    title: "Exhibitors",
    href: "/exhibitors",
    description:
      "Discover exhibitors showcasing cutting-edge security solutions.",
    icon: MagicWandIcon,
  },
  {
    sort_order: 20,
    title: "Vendors",
    href: "/vendors",
    description: "Browse official vendors offering gear, swag, and services.",
    icon: CubeIcon,
  },
].sort((a, b) => a.sort_order - b.sort_order);
