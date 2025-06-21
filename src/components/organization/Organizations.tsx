import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader } from "@/components/ui/card";
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

  return (
    <section className="my-10 mx-5">
      <h2 className="mb-4 text-2xl font-semibold">{title}</h2>

      {/* Search */}
      <div className="mb-6 flex items-center space-x-2">
        <SearchIcon className="w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={`Search ${title}…`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground">
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
              <Card>
                <CardHeader className="flex items-center space-x-4 pb-0">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                    <Image
                      src={o.logo.url}
                      alt={`${o.name} logo`}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <h3 className="text-lg font-medium">{o.name}</h3>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
