/* eslint-disable @typescript-eslint/no-unused-vars */
import { Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon as MenuIcon,
  InformationCircleIcon as InformationCircleIconSoild,
  UserIcon as UserIconSoild,
  BookmarkIcon as BookmarkIconSoild,
  CalendarIcon as CalendarIconSoild,
  MapPinIcon as LocationMarkerIconSoild,
  TagIcon as TagIconSoild,
  DevicePhoneMobileIcon as DeviceMobileIconSoild,
  MapIcon as MapIconSoild,
} from "@heroicons/react/24/solid";
import {
  InformationCircleIcon as InformationCircleIconOutline,
  CalendarIcon as CalendarIconOutline,
  BookmarkIcon as BookmarkIconOutline,
  UserIcon as UserIconOutline,
  MapPinIcon as LocationMarkerIconOutline,
  TagIcon as TagIconOutline,
  DevicePhoneMobileIcon as DeviceMobileIconOutline,
  MapIcon as MapIconOutline,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import skullLogo from "../../../public/images/skull_200x200.png";
import Image from "next/image";

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
                    <CalendarIconSoild className="w-6 mr-2" />
                  ) : (
                    <CalendarIconOutline className="w-6 mr-2" />
                  )}
                  <p>Home</p>
                </span>
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }: { active: boolean }) => (
              <Link href="/events">
                <span className="flex my-3">
                  {active ? (
                    <CalendarIconSoild className="w-6 mr-2" />
                  ) : (
                    <CalendarIconOutline className="w-6 mr-2" />
                  )}
                  <p>Schedule</p>
                </span>
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }: { active: boolean }) => (
              <Link href="/info">
                <span className="flex my-3">
                  {active ? (
                    <InformationCircleIconSoild className="w-6 mr-2" />
                  ) : (
                    <InformationCircleIconOutline className="w-6 mr-2" />
                  )}
                  <p>Info</p>
                </span>
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }: { active: boolean }) => (
              <Link href="/bookmarks">
                <span className="flex my-3">
                  {active ? (
                    <BookmarkIconSoild className="w-6 mr-2" />
                  ) : (
                    <BookmarkIconOutline className="w-6 mr-2" />
                  )}
                  <p>Bookmarks</p>
                </span>
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }: { active: boolean }) => (
              <Link href="/maps">
                <span className="flex my-3">
                  {active ? (
                    <MapIconSoild className="w-6 mr-2" />
                  ) : (
                    <MapIconOutline className="w-6 mr-2" />
                  )}
                  <p>Maps</p>
                </span>
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }: { active: boolean }) => (
              <Link href="/locations">
                <span className="flex my-3">
                  {active ? (
                    <LocationMarkerIconSoild className="w-6 mr-2" />
                  ) : (
                    <LocationMarkerIconOutline className="w-6 mr-2" />
                  )}
                  <p>Locations</p>
                </span>
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }: { active: boolean }) => (
              <Link href="/tags">
                <span className="flex my-3">
                  {active ? (
                    <TagIconSoild className="w-6 mr-2" />
                  ) : (
                    <TagIconOutline className="w-6 mr-2" />
                  )}
                  <p>Tags</p>
                </span>
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }: { active: boolean }) => (
              <Link href="/speakers">
                <span className="flex my-3">
                  {active ? (
                    <UserIconSoild className="w-6 mr-2" />
                  ) : (
                    <UserIconOutline className="w-6 mr-2" />
                  )}
                  <p>Speakers</p>
                </span>
              </Link>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }: { active: boolean }) => (
              <Link href="/apps">
                <span className="flex">
                  {active ? (
                    <DeviceMobileIconSoild className="w-6 mr-2" />
                  ) : (
                    <DeviceMobileIconOutline className="w-6 mr-2" />
                  )}
                  <p>Apps</p>
                </span>
              </Link>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
