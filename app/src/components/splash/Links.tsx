/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from "next/link";
import { useState } from "react";
import localFont from "next/font/local";
import { links } from "../../utils/links";

const benguiatFont = localFont({
  src: "../../../public/fonts/benguiat.woff",
  display: "swap",
  variable: "--font-benguiat",
});

function Links() {
  const [active, setActive] = useState("");

  return (
    <div className="flex items-center justify-center mt-6">
      <div className="text-center grid grid-cols-2 gap-1 gap-x-12">
        {links.map((l) => (
          <Link href={l.url} key={l.label}>
            <button
              type="button"
              className="flex align-middle items-center p-1"
              onMouseEnter={() => {
                setActive(l.label);
              }}
              onMouseLeave={() => {
                setActive("");
              }}
            >
              <div>
                {active !== l.label ? (
                  <l.icon className="h-7 sm:h-8 md:h-9 lg:h-10 mr-2" />
                ) : (
                  <l.active className="h-7 sm:h-8 md:h-9 lg:h-10 mr-2" />
                )}
              </div>
              <h3
                className={`text-base sm:text-lg md:text-xl lg:text-2xl ${benguiatFont.className}`}
              >
                {l.label}
              </h3>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Links;
