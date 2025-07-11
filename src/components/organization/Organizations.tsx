import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

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
    <section className="my-10 mx-5">
      <h2 className="mb-4 text-2xl font-semibold text-gray-100">{title}</h2>

      {/* Search */}
      <div className="mb-6 flex items-center space-x-3">
        <SearchIcon className="w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder={`Search ${title}…`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-gray-700 placeholder-gray-400 text-gray-100 rounded-full focus:ring-indigo-500"
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
              className="block transform hover:scale-[1.02] transition-transform duration-200"
            >
              <Card
                className="
                  bg-gradient-to-br from-gray-800 to-gray-700
                  border border-gray-700
                  shadow-lg
                  rounded-2xl
                  hover:from-gray-700 hover:to-gray-600
                  ring-offset-2 ring-indigo-500 hover:ring-2
                  transition-all duration-200
                  overflow-hidden
                "
              >
                <CardContent className="flex flex-col items-center p-6 space-y-4">
                  {/* logo or initials fallback */}
                  {o.logo?.url ? (
                    <div className="relative w-24 h-24">
                      <Image
                        src={o.logo.url}
                        alt={`${o.name} logo`}
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  ) : (
                    <div
                      className="
                        flex items-center justify-center
                        w-24 h-24 rounded-full
                        bg-indigo-600
                        text-white text-2xl font-bold
                      "
                    >
                      {getInitials(o.name)}
                    </div>
                  )}
                  <h3 className="text-lg font-medium text-gray-100 text-center">
                    {o.name}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
