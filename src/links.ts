import { HeadingLink, SideMenu } from "./ht";

export const sideLinks = (): SideMenu[] => {
  const main: SideMenu = {
    heading: "Main",
    links: [
      {
        text: "Discord",
        href: "https://discord.gg/defcon",
      },
      {
        text: "Official Talks",
        href: "https://www.youtube.com/user/DEFCONConference",
      },
    ],
  };

  const villages: SideMenu = {
    heading: "Villages",
    links: [
      {
        text: "Aerospace Village",
        href: "https://aerospacevillage.org",
      },
      {
        text: "AI Village",
        href: "https://aivillage.org/",
      },
      {
        text: "AppSec Village",
        href: "https://www.appsecvillage.com/",
      },
      {
        text: "BioHacking Village",
        href: "http://villageb.io/",
      },
      {
        text: "BlockChain Village",
        href: "https://www.blockchainvillage.net/",
      },
      {
        text: "Blue Team Village",
        href: "http://blueteamvillage.org/",
      },
      {
        text: "Car Hacking Village",
        href: "https://www.carhackingvillage.com/",
      },
      {
        text: "Cloud Village",
        href: "https://cloud-village.org/",
      },
      {
        text: "Crypto and Privacy Village",
        href: "https://cryptovillage.org/",
      },
      {
        text: "Data Duplication Village",
        href: "https://dcddv.org/",
      },
      {
        text: "Ethics Village",
        href: "http://ethicsvillage.org/",
      },
      {
        text: "Hack The Sea Village",
        href: "http://hackthesea.org/",
      },
      {
        text: "Ham Village",
        href: "http://hamvillage.org/",
      },
      {
        text: "Hardware Village",
        href: "https://www.dchhv.org/",
      },
      {
        text: "ICS Village",
        href: "http://www.icsvillage.com/",
      },
      {
        text: "IoT Village",
        href: "https://www.iotvillage.org/",
      },
      {
        text: "Lock Bypass Village",
        href: "http://bypassvillage.org/",
      },
      {
        text: "Lockpick Village",
        href: "https://toool.us/",
      },
      {
        text: "Monero Village",
        href: "http://monerovillage.org/",
      },
      {
        text: "Password Village",
        href: "https://passwordvillage.com/",
      },
      {
        text: "Payment Village",
        href: "https://paymentvillage.org/",
      },
      {
        text: "Packet Hacking Village",
        href: "https://www.wallofsheep.com/",
      },
      {
        text: "Recon Village",
        href: "http://reconvillage.org/",
      },
      {
        text: "Red Team Village",
        href: "https://redteamvillage.io/",
      },
      {
        text: "Rogues Village",
        href: "https://www.foursuitsmagic.com/roguesvillage",
      },
      {
        text: "Social Engineering Village",
        href: "https://www.social-engineer.org/sevillage-def-con/",
      },
      {
        text: "Wireless Village",
        href: "https://wirelessvillage.ninja/",
      },
    ].sort((a, b) => {
      if (a.text < b.text) {
        return -1;
      }
      return 1;
    }),
  };

  return [main, villages];
};

export const headingLinks: HeadingLink[] = [
  {
    href: "https://defcon.org/html/defcon-29/dc-29-index.html",
    text: "DEF CON 29",
  },
];
