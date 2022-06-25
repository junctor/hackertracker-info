/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Menu } from "@headlessui/react";
import {
  MenuIcon,
  UserIcon as UserIconSoild,
  StarIcon as StarIconSoild,
  CalendarIcon as CalendarIconSoild,
} from "@heroicons/react/solid";
import {
  CalendarIcon as CalendarIconOutline,
  StarIcon as StarIconOutline,
  UserIcon as UserIconOutline,
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
        <MenuIcon className='h-7 w-7 text-white ml-3' />
      </Menu.Button>
      <Menu.Items className='absolute bg-black'>
        <Menu.Item>
          <div className='w-32'>
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
            <PageLink href='/events' active={active}>
              <span className='flex mt-2 mb-2'>
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
            <PageLink href='/events/bookmarks' active={active}>
              <span className='flex mt-2 mb-2'>
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
            <PageLink href='/speakers' active={active}>
              <span className='flex mt-2 mb-2'>
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
      </Menu.Items>
    </Menu>
  );
}
