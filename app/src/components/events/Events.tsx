"use client";

import React from "react";
import { useState } from "react";
import { tabDateTitle } from "../../lib/utils/dates";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Search from "./Search";
import EventCell from "./EventCell";
import {
  Table,
  TableBody,
  TableCaption,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/16/solid";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Events({
  dateGroup,
}: {
  dateGroup: Map<string, EventData[]>;
}) {
  const [day, setDay] = useState(
    (dateGroup.keys().next().value as string) ?? ""
  );

  const categoriesMap = Array.from(dateGroup.values())
    .flat()
    .reduce((acc, event) => {
      acc.set(event.category, true);
      return acc;
    }, new Map<string, boolean>());

  const [categories, setCategories] = useState(categoriesMap);

  const locationsMap = Array.from(dateGroup.values())
    .flat()
    .reduce((acc, event) => {
      acc.set(event.location, true);
      return acc;
    }, new Map<string, boolean>());

  const [locations, setLocations] = useState(locationsMap);

  const categoryColors = Array.from(dateGroup.values())
    .flat()
    .reduce((acc, event) => {
      acc.set(event.category, event.color);
      return acc;
    }, new Map<string, string>());

  function toggleLocations(key: string) {
    setLocations((prev) => new Map(prev).set(key, !(prev.get(key) ?? false)));
  }

  function toggleCategory(key: string) {
    setCategories((prev) => new Map(prev).set(key, !(prev.get(key) ?? false)));
  }

  return (
    <div>
      <div className="ml-2 md:ml-5 items-center grid bg-background py-3 align-middle grid-cols-2 md:grid-cols-4 gap-1">
        <div>
          <h1 className="text-base sm:text-base md:text-lg lg:text-xl font-bold row-span-2 md:row-span-1">
            Test
          </h1>
        </div>
        <div className="col-span-2 order-last md:order-none md:items-center md:justify-center">
          <Tabs
            value={day}
            defaultValue={day}
            onValueChange={(value) => {
              setDay(value);
            }}
          >
            <TabsList>
              {Array.from(dateGroup).map(([tabDay]) => (
                <TabsTrigger value={tabDay} key={tabDay}>
                  <p className="text-xs md:text-sm">{tabDateTitle(tabDay)}</p>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="justify-self-end pr-5 align-middle">
          <span className="mr-1">
            <Dialog>
              <DialogTrigger>
                <Button variant="ghost" size="icon">
                  <AdjustmentsHorizontalIcon className="h-6" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filters</DialogTitle>
                  <DialogDescription>
                    <div>
                      <div className="my-2">
                        <h3 className="text-sm md:text-base font-bold">
                          Locations
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-row gap-4">
                          {Array.from(locations.keys())
                            .sort()
                            .map((location) => (
                              <div
                                className="flex items-center space-x-2 my-3"
                                key={location}
                              >
                                <Switch
                                  id={location}
                                  checked={locations.get(location) ?? false}
                                  onCheckedChange={() => {
                                    toggleLocations(location);
                                  }}
                                />
                                <Label htmlFor={location}>{location}</Label>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div className="my-2 mt-5">
                        <h3 className="text-sm md:text-base font-bold my-2 mt-1">
                          Categories
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-row gap-4">
                          {Array.from(categories.keys())
                            .sort()
                            .map((category) => (
                              <div
                                className="flex items-center space-x-2 my-2"
                                key={category}
                              >
                                <Switch
                                  className={`data-[state=checked]:bg-[${categoryColors.get(
                                    category
                                  )}] bg-[${categoryColors.get(category)}]`}
                                  id={category}
                                  checked={categories.get(category) ?? false}
                                  onCheckedChange={() => {
                                    toggleCategory(category);
                                  }}
                                />
                                <Label htmlFor={category}>{category}</Label>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </span>
          <Search dateGroup={dateGroup} />
        </div>
      </div>
      <div className="mb-10">
        <Table>
          <TableCaption>Events for DEF CON 32</TableCaption>
          <TableBody>
            {(dateGroup.get(day) ?? [])
              .filter(
                (e) =>
                  (categories.get(e.category) ?? false) &&
                  locations.get(e.location)
              )
              .map((htEvent) => (
                <TableRow key={htEvent.id} id={`e-${htEvent.id}`}>
                  <EventCell event={htEvent} />
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
