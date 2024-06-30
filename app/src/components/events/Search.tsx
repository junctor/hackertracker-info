import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "../ui/button";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import Link from "next/link";
import React from "react";

export default function Search({
  dateGroup,
}: {
  dateGroup: Map<string, EventData[]>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon">
        <MagnifyingGlassIcon
          className="h-6"
          onClick={() => {
            setOpen(!open);
          }}
        />
      </Button>
      <Command className="rounded-lg  shadow-md">
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Events">
              {Array.from(dateGroup.values())
                .flatMap((e) => e)
                .sort((a, b) =>
                  a.title.toLowerCase().localeCompare(b.title.toLowerCase())
                )
                .map((e) => (
                  <CommandItem key={e.id} value={e.title}>
                    <Link
                      href={`../event?id=${e.id}`}
                      prefetch={false}
                      className={`hover:text-[${e.color}] font-bold`}
                    >
                      {e.title}
                    </Link>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </Command>
    </>
  );
}
