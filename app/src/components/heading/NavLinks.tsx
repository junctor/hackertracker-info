/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Menu } from "@headlessui/react";
import { MenuIcon } from "@heroicons/react/solid";
import { CalendarIcon, UserIcon } from "@heroicons/react/outline";

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
        <MenuIcon className='h-7 w-7 text-white' />
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
                <CalendarIcon className='w-6 mr-2' />
                <p className=''>Schedule</p>
              </span>
            </PageLink>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }: any) => (
            <PageLink href='/events' active={active}>
              <span className='flex mt-2 mb-2'>
                <UserIcon className='w-6 mr-2 mt' />
                <p className=''>Speakers</p>
              </span>
            </PageLink>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
