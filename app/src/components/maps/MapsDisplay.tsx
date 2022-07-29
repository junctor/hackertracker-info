/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @next/next/no-img-element */
import { Tab } from "@headlessui/react";

function MapsDisplay({ conference }: MapProps) {
  const confMaps: { name: string; map: string }[] = (
    conference?.maps ?? []
  ).map((m: HTMaps) => ({
    name: m.name,
    map: m.file,
  }));

  return (
    <div className='mt-10 w-full px-10 items-center align-middle text-center'>
      <Tab.Group>
        <Tab.List className='my-2 justify-center items-center flex'>
          {confMaps.map((m) => (
            <Tab key={m.name}>
              {({ selected }: { selected: boolean }) => (
                <button
                  type='button'
                  className={`
                   p-2 mx-1 rounded-lg text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white
                     ${selected ? "bg-dc-blue" : "hover:text-gray-400"}
                   `}>
                  {m.name}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {confMaps.map((m) => (
            <Tab.Panel key={m.name}>
              <div
                key={m.map}
                className='sm:inline p-2 mx-1 rounded-lg text-sm sm:text-base md:text-lg lg:text-xl font-bold hover:text-dc-pink'>
                <a
                  href={`/static/con/maps/${m.map}`}
                  target='_blank'
                  rel='noopener noreferrer'>
                  {`${m.name} Map`}
                </a>
                <embed
                  src={`/static/con/maps/${m.map}`}
                  width='100%'
                  height='800px'
                  type='application/pdf'
                />
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default MapsDisplay;
