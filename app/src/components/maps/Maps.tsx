import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Maps({ conference }: { conference: HTConference }) {
  const confMaps: Array<{ name: string; map: string }> = (
    conference?.maps ?? []
  ).map((m: HTMaps) => ({
    name: m.name,
    map: m.file,
  }));

  return (
    <div className="mx-5">
      <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
        Maps
      </h1>
      <div className="mt-10 w-full px-10 items-center align-middle text-center">
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            {confMaps.map((m) => (
              <TabsTrigger key={m.name} value={m.name}>
                {m.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {confMaps.map((m) => (
            <TabsContent key={m.name} value={m.name}>
              <div
                key={m.map}
                className="sm:inline p-2 mx-1 rounded-lg text-sm sm:text-base md:text-lg lg:text-xl font-bold hover:text-dc-purple"
              >
                <a
                  href={`/ht/maps/${m.map}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`${m.name} Map`}
                </a>
                <embed
                  src={`/ht/maps/${m.map}`}
                  width="100%"
                  height="800px"
                  type="application/pdf"
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default Maps;
