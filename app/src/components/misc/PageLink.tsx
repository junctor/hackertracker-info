/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
import Link from "next/link";
import { forwardRef } from "react";

const PageLink = forwardRef((props: any, ref: any) => {
  const { href, children, active, ...rest } = props;
  return (
    <Link href={href}>
      <a className={`block ${active}`} ref={ref} {...rest}>
        {children}
      </a>
    </Link>
  );
});

PageLink.displayName = "PageLink";

export default PageLink;
