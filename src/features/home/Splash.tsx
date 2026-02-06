import Countdown from "@/features/home/Countdown";
import Image from "next/image";
import localFont from "next/font/local";
import { getSiteMenu } from "@/lib/menu";
import Link from "next/link";
import { ConferenceManifest } from "@/lib/conferences";

const museoFont = localFont({
  src: "../../../public/fonts/Museo700-Regular.woff2",
  display: "swap",
  variable: "--font-museo",
});

type Props = {
  conference: ConferenceManifest;
};

export default function Splash({ conference }: Props) {
  const navMenu = getSiteMenu(conference);

  return (
    <section className="py-16 max-w-6xl mx-auto px-4">
      {/* Hero */}
      <div className="text-center space-y-4 align-middle items-center justify-center flex flex-col">
        <h1 className="sr-only">{conference.name}</h1>
        <div
          style={{
            position: "relative",
            width: "min(480px, 60vw)",
            height: 120,
          }}
        >
          <Image
            src={`/images/${conference.logoFile}`}
            alt={conference.name}
            fill
            priority
            sizes="(min-width: 768px) 480px, 60vw"
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Date */}
        <time
          dateTime={conference.begin}
          className={`text-xs sm:text-sm md:text-base text-gray-300/90 uppercase tracking-[0.16em] sm:tracking-[0.22em] ${museoFont.className}`}
        >
          {conference.dateLabel}
        </time>

        {/* Countdown */}
        <Countdown conference={conference} />
      </div>
      {/* Menu */}
      <nav aria-label="Primary" className="mt-12">
        <ul className="grid grid-cols-2 list-none gap-6 p-0 m-0 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {navMenu.map((item) => {
            const Icon = item.icon;
            const isExternal = item.href.startsWith("http");

            return (
              <li key={item.sort_order}>
                {isExternal ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.title}
                    className="flex flex-col items-center justify-center p-5 bg-gray-800 rounded-2xl shadow-md hover:scale-105 hover:shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                  >
                    <Icon className="h-6 w-6 mb-2 text-gray-200" aria-hidden />
                    <span className="text-sm font-semibold text-gray-100">
                      {item.title}
                    </span>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    aria-label={item.title}
                    className="flex flex-col items-center justify-center p-5 bg-gray-800 rounded-2xl shadow-md hover:scale-105 hover:shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                  >
                    <Icon className="h-6 w-6 mb-2 text-gray-200" aria-hidden />
                    <span className="text-sm font-semibold text-gray-100">
                      {item.title}
                    </span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </section>
  );
}
