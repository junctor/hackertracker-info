/* eslint-disable @typescript-eslint/no-unused-vars */
import { Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon as MenuIcon,
  HomeIcon as HomeIconSoild,
} from "@heroicons/react/24/solid";
import { HomeIcon as HomeIconOutline } from "@heroicons/react/24/outline";
import Link from "next/link";
import skullLogo from "../../../public/images/skull_200x200.png";
import Image from "next/image";
import localFont from "next/font/local";
import { links } from "../../utils/links";

const benguiatFont = localFont({
  src: "../../../public/fonts/benguiat.woff",
  display: "swap",
  variable: "--font-benguiat",
});

export default function NavLinks() {
  return (
    <Menu>
      <Menu.Button className="align-middle">
        <MenuIcon className="w-7 sm:w-8 md:w-9 lg:w-10 ml-1" />
      </Menu.Button>
      <Transition
        enter="transition duration-100 ease-in"
        enterFrom="transform scale-50 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-300 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-50 opacity-0"
      >
        <Menu.Items className="absolute bg-black text-white rounded-b-lg py-2 px-2">
          <Menu.Item>
            <div>
              <Image
                src={skullLogo}
                alt="DEF CON 31 Logo"
                className="w-42 hover:rotate-12"
              />
            </div>
          </Menu.Item>
          <Menu.Item>
            {({ active }: { active: boolean }) => (
              <Link href="/">
                <span className="flex my-3">
                  {active ? (
                    <HomeIconSoild className="w-6 mr-2" />
                  ) : (
                    <HomeIconOutline className="w-6 mr-2" />
                  )}
                  <p className={`${benguiatFont.className}`}>Home</p>
                </span>
              </Link>
            )}
          </Menu.Item>
          {links.map((l) => (
            <Menu.Item key={l.label}>
              {({ active }: { active: boolean }) => (
                <Link href={`/${l.url}`}>
                  <span className="flex my-3">
                    {active ? (
                      <l.active className="w-6 mr-2" />
                    ) : (
                      <l.icon className="w-6 mr-2" />
                    )}
                    <p className={`${benguiatFont.className}`}>{l.label}</p>
                  </span>
                </Link>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
