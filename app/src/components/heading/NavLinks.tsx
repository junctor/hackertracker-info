import Link from "next/link";
import { Menu } from "@headlessui/react";
import { MenuIcon } from "@heroicons/react/solid";
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
          {({ active }: any) => (
            <PageLink href='/schedule' active={active}>
              Schedule
            </PageLink>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
