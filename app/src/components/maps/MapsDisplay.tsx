/* eslint-disable react/no-unused-prop-types */
import { Tab } from "@headlessui/react";

/* eslint-disable @next/next/no-img-element */
function MapsDisplay({ conference }: MapProps) {
  const confMaps = (conference?.maps ?? []).map((m) => ({
    name: m.name,
    map: m.file,
  }));

  return (
    <div className='mt-10 w-full px-10'>
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
              <embed
                src={`/static/conf/maps/${m.map}`}
                width='100%'
                height='800px'
                type='application/pdf'
              />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default MapsDisplay;
