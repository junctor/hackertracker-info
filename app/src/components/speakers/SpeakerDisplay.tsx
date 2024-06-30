import Link from "next/link";
import React from "react";

export default function SpeakerDisplay({ speakers }: { speakers: Speaker[] }) {
  return (
    <div>
      {speakers.map((s) => (
        <div key={s.id} className="ml-5 my-5">
          <Link href={`/speaker?id=${s.id}`} prefetch={false}>
            <button
              type="button"
              className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold hover:text-dc-red"
            >
              {s.name}
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}
