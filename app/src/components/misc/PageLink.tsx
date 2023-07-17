import Link from "next/link";
import { forwardRef } from "react";

const PageLink = forwardRef((props: any, ref: any) => {
  const { href } = props;
  return <Link href={href}></Link>;
});

PageLink.displayName = "PageLink";

export default PageLink;
