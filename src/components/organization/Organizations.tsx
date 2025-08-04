import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Organizations } from "@/types/info";

interface OrgsProps {
  orgs: Organizations;
  title: string;
}

export default function Orgs({ orgs, title }: OrgsProps) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      orgs.filter((o) => o.name.toLowerCase().includes(search.toLowerCase())),
    [orgs, search]
  );

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <section className="my-10 mx-auto px-5 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-100">
          {title}
        </h1>
        <Input
          type="text"
          placeholder={`Search ${title}…`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-auto max-w-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400">
          No {title.toLowerCase()} found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((o) => (
            <Link
              key={o.id}
              href={`/organization/?id=${o.id}`}
              className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-2xl"
            >
              <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-700 shadow-lg rounded-2xl hover:from-gray-700 hover:to-gray-600 ring-offset-2 ring-indigo-500 hover:ring-2 transition-all transform hover:scale-[1.02] overflow-hidden">
                <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                  {o.logo?.url ? (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                      <Image
                        className="object-contain"
                        src={o.logo.url}
                        alt={`${o.name} logo`}
                        fill
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-24 h-24 rounded-lg bg-indigo-600 text-white text-2xl font-bold">
                      {getInitials(o.name)}
                    </div>
                  )}
                  <h2 className="text-lg font-medium text-gray-100 text-center">
                    {o.name}
                  </h2>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
