import React, { useState } from "react";
import { ConferenceMap } from "@/types/info";

interface MapsProps {
  maps: ConferenceMap[];
}

export default function Maps({ maps }: MapsProps) {
  if (!maps.length) {
    return <p className="text-muted">No maps available.</p>;
  }

  return (
    <div className="space-y-8 mx-5">
      <h2 className="text-2xl font-bold my-5">Conference Maps</h2>

      {maps.map((map) => (
        <MapCard key={map.id} map={map} />
      ))}
    </div>
  );
}

function MapCard({ map }: { map: ConferenceMap }) {
  const [svgError, setSvgError] = useState(false);

  return (
    <div className="border rounded p-4 shadow-sm">
      <h3 className="font-semibold text-lg mb-4">{map.name}</h3>

      {!svgError ? (
        <img
          src={map.svg_url}
          alt={`Map of ${map.name}`}
          className="w-full h-auto rounded border mb-4"
          onError={() => setSvgError(true)}
        />
      ) : (
        <p className="text-sm text-gray-600 mb-4">
          SVG couldn’t be displayed.{" "}
          <a
            href={map.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View PDF
          </a>
          .
        </p>
      )}

      <div className="flex gap-4 text-sm">
        <a
          href={map.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View full screen
        </a>
        <a href={map.url} download className="text-blue-600 underline">
          Download PDF
        </a>
      </div>
    </div>
  );
}
