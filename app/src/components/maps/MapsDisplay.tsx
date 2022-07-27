import type { HTMaps } from "../../ht";

/* eslint-disable @next/next/no-img-element */
function MapsDisplay({ conference }: MapProps) {
  const confMaps: { name: string; map: string }[] = (
    conference?.maps ?? []
  ).map((m: HTMaps) => ({
    name: m.name,
    map: m.file,
  }));

  return (
    <div className='mt-10 w-full px-10 items-center align-middle text-center'>
      <div>
        {confMaps.map((m) => (
          <div
            key={m.map}
            className='sm:inline p-2 mx-1 rounded-lg text-sm sm:text-base md:text-lg lg:text-xl font-bold hover:text-dc-pink'>
            <a
              href={`/static/con/maps/${m.map}`}
              target='_blank'
              rel='noopener noreferrer'>
              {m.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MapsDisplay;
