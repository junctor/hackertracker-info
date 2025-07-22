import React from "react";

interface Map {
  name: string;
  url: string;
}

export default function Maps({ maps }: { maps?: Map[] }) {
  if (!maps || maps.length === 0) {
    return <p className="text-muted">No maps available.</p>;
  }

  return (
    <div className="space-y-8 mx-5">
      <h2 className="text-2xl font-bold my-5">Conference Maps</h2>

      {maps.map((map, index) => (
        <div key={index} className="border rounded p-4 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">{map.name}</h3>

          {/* Display inline if allowed */}
          <object
            data={map.url}
            type="application/pdf"
            width="100%"
            height="600"
            className="rounded border mb-4"
          >
            <p className="text-sm text-gray-600 my-10 mx-5">
              PDF cannot be displayed inline.
              <a
                href={map.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mx-5"
              >
                View map in new tab
              </a>
            </p>
          </object>

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
      ))}
    </div>
  );
}
