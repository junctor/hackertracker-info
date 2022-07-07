/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import {
  MenuIcon,
  InformationCircleIcon as InformationCircleIconSoild,
  UserIcon as UserIconSoild,
  StarIcon as StarIconSoild,
  CalendarIcon as CalendarIconSoild,
  LocationMarkerIcon as LocationMarkerIconSoild,
  TagIcon as TagIconSoild,
  DeviceMobileIcon as DeviceMobileIconSoild,
} from "@heroicons/react/solid";
import {
  InformationCircleIcon as InformationCircleIconOutline,
  CalendarIcon as CalendarIconOutline,
  StarIcon as StarIconOutline,
  UserIcon as UserIconOutline,
  LocationMarkerIcon as LocationMarkerIconOutline,
  TagIcon as TagIconOutline,
  DeviceMobileIcon as DeviceMobileIconOutline,
} from "@heroicons/react/outline";

import { forwardRef } from "react";

export default function NavLinks() {
  // eslint-disable-next-line react/display-name
  const PageLink = forwardRef((props: any, ref: any) => {
    let { href, children, active, ...rest } = props;
    return (
      <Link href={href}>
        <a className={`block ${active}`} ref={ref} {...rest}>
          {children}
        </a>
      </Link>
    );
  });

  return (
    <Menu>
      <Menu.Button>
        <MenuIcon className='h-8 w-8  ml-3' />
      </Menu.Button>
      <Transition
        enter='transition duration-100 ease-in'
        enterFrom='transform scale-50 opacity-0'
        enterTo='transform scale-100 opacity-100'
        leave='transition duration-300 ease-out'
        leaveFrom='transform scale-100 opacity-100'
        leaveTo='transform scale-50 opacity-0'>
        <Menu.Items className='absolute bg-black rounded-b-lg py-2 px-2'>
          <Menu.Item>
            <div className='w-32 hover:rotate-12'>
              <img
                src='/static/img/skull_200x200.png'
                alt='DEF CON Logo'
                width={100}
                height={100}
              />
            </div>
          </Menu.Item>
          <Menu.Item>
            {({ active }: any) => (
              <PageLink href='/' active={active}>
                <span className='flex my-3'>
                  {active ? (
                    <CalendarIconSoild className='w-6 mr-2' />
                  ) : (
                    <CalendarIconOutline className='w-6 mr-2' />
                  )}
                  <p>Home</p>
                </span>
              </PageLink>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }: any) => (
              <PageLink href='/info' active={active}>
                <span className='flex my-3'>
                  {active ? (
                    <InformationCircleIconSoild className='w-6 mr-2' />
                  ) : (
                    <InformationCircleIconOutline className='w-6 mr-2' />
                  )}
                  <p>Info</p>
                </span>
              </PageLink>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }: any) => (
              <PageLink href='/events' active={active}>
                <span className='flex my-3'>
                  {active ? (
                    <CalendarIconSoild className='w-6 mr-2' />
                  ) : (
                    <CalendarIconOutline className='w-6 mr-2' />
                  )}
                  <p>Schedule</p>
                </span>
              </PageLink>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }: any) => (
              <PageLink href='/bookmarks' active={active}>
                <span className='flex my-3'>
                  {active ? (
                    <StarIconSoild className='w-6 mr-2' />
                  ) : (
                    <StarIconOutline className='w-6 mr-2' />
                  )}
                  <p>Bookmarks</p>
                </span>
              </PageLink>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }: any) => (
              <PageLink href='/categories' active={active}>
                <span className='flex my-3'>
                  {active ? (
                    <TagIconSoild className='w-6 mr-2' />
                  ) : (
                    <TagIconOutline className='w-6 mr-2' />
                  )}
                  <p>Categories</p>
                </span>
              </PageLink>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }: any) => (
              <PageLink href='/speakers' active={active}>
                <span className='flex my-3'>
                  {active ? (
                    <UserIconSoild className='w-6 mr-2' />
                  ) : (
                    <UserIconOutline className='w-6 mr-2' />
                  )}
                  <p>Speakers</p>
                </span>
              </PageLink>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }: any) => (
              <PageLink href='/maps' active={active}>
                <span className='flex my-3'>
                  {active ? (
                    <LocationMarkerIconSoild className='w-6 mr-2' />
                  ) : (
                    <LocationMarkerIconOutline className='w-6 mr-2' />
                  )}
                  <p>Maps</p>
                </span>
              </PageLink>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }: any) => (
              <PageLink href='/hackertracker' active={active}>
                <span className='flex'>
                  {active ? (
                    <DeviceMobileIconSoild className='w-6 mr-2' />
                  ) : (
                    <DeviceMobileIconOutline className='w-6 mr-2' />
                  )}
                  <p>Apps</p>
                </span>
              </PageLink>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
