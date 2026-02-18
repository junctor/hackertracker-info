import Countdown from "@/features/home/Countdown";
import Image from "next/image";
import localFont from "next/font/local";
import Link from "next/link";
import { ConferenceManifest } from "@/lib/conferences";
import { useRouter } from "next/router";
import { useEffect } from "react";

const museoFont = localFont({
  src: "../../../public/fonts/Museo700-Regular.woff2",
  display: "swap",
  variable: "--font-museo",
});

type Props = {
  conference: ConferenceManifest;
};

export default function Splash({ conference }: Props) {
  const router = useRouter();

  const kickoffDateMs = new Date(conference.kickoff).valueOf();
  const now = Date.now();
  const hasKickoffPassed = now >= kickoffDateMs;

  useEffect(() => {
    if (hasKickoffPassed) {
      router.replace(`/${conference.slug}/menu`);
    }
  }, [hasKickoffPassed, conference.slug, router]);

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
          <Link href={`/${conference.slug}/menu`}>
            <Image
              src={`/images/${conference.logoFile}`}
              alt={conference.name}
              fill
              priority
              sizes="(min-width: 1024px) 480px, (min-width: 640px) 46vw, 92vw"
              style={{ objectFit: "contain" }}
            />
          </Link>
        </div>
        {/* Date */}
        <time
          dateTime={conference.begin}
          className={`text-xs sm:text-sm md:text-base text-gray-300/90 uppercase tracking-[0.16em] sm:tracking-[0.22em] ${museoFont.className}`}
        >
          {conference.dateLabel}
        </time>

        {/* Menu Link */}
        <Link
          href={`/${conference.slug}/menu`}
          className="mt-4 inline-block rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          View Menu
        </Link>

        {/* Countdown */}
        {!hasKickoffPassed && <Countdown conference={conference} />}
      </div>
    </section>
  );
}
