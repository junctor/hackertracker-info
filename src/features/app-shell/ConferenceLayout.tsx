import { useLayoutEffect, useRef, type ReactNode } from "react";

import type { ConferenceManifest } from "@/lib/conferences";
import type { PageId } from "@/lib/types/page-meta";

import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

const SITE_FOOTER_BLOCK_SIZE_VAR = "--site-footer-block-size";

type Props = {
  conference: ConferenceManifest;
  activePageId: PageId;
  children: ReactNode;
  className?: string;
};

export default function ConferenceLayout({ conference, activePageId, children, className }: Props) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    const footer = footerRef.current;

    if (!shell || !footer) return;

    let lastBlockSize = "";

    const updateFooterBlockSize = () => {
      const nextBlockSize = `${footer.getBoundingClientRect().height}px`;

      if (nextBlockSize === lastBlockSize) return;

      shell.style.setProperty(SITE_FOOTER_BLOCK_SIZE_VAR, nextBlockSize);
      lastBlockSize = nextBlockSize;
    };

    updateFooterBlockSize();

    if (typeof ResizeObserver === "undefined") return;

    const resizeObserver = new ResizeObserver(updateFooterBlockSize);
    resizeObserver.observe(footer);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={shellRef}
      className={["ui-page-shell", className].filter(Boolean).join(" ")}
      data-conference={conference.slug}
    >
      <SiteHeader conference={conference} activePageId={activePageId} />
      <main id="main-content" className="ui-page-main">
        {children}
      </main>
      <SiteFooter ref={footerRef} conference={conference} />
    </div>
  );
}
