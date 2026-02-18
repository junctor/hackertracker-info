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
              sizes="(min-width: 768px) 480px, 60vw"
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
        {/* Countdown */}
        {!hasKickoffPassed && <Countdown conference={conference} />}
      </div>
    </section>
  );
}
