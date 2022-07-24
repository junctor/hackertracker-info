import Link from "next/link";
import { memo } from "react";

function SpeakerDisplay({ speakers }: { speakers: Speaker[] }) {
  return (
    <div>
      {speakers.map((s) => (
        <div key={s.id} className='ml-10 my-5'>
          <Link href={`/speakers/${s.id}`} prefetch={false}>
            <button
              type='button'
              className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold hover:text-dc-red'>
              {s.name}
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default memo(SpeakerDisplay);
