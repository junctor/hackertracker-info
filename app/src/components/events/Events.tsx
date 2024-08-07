"use client";

import React from "react";
import { useState } from "react";
import { eventDay, tabDateTitle } from "../../lib/utils/dates";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Search from "./Search";
import EventCell from "./EventCell";
import { Table, TableBody, TableCaption } from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Events({
  dateGroup,
  tags,
}: {
  dateGroup: Map<string, EventData[]>;
  tags: HTTag[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tagId = searchParams.get("tag") ?? "0";

  const [selectedTag, setSelectedTag] = useState(parseInt(tagId));

  const days = [...dateGroup]
    .filter(
      (dg) =>
        selectedTag === 0 ||
        dg[1].some((e) => e.tags?.some((t) => t.id == selectedTag))
    )
    .map((dg) => dg[0]);

  const selectedTagDetails = tags
    .flatMap((t) => t.tags)
    .find((e) => e.id === parseInt(tagId));

  const nowDay = eventDay(new Date());

  const dayIndex = days.findIndex((d) => d === nowDay);

  const [day, setDay] = useState(
    (dayIndex === -1 ? days[0] : days[dayIndex]) ?? ""
  );

  return (
    <>
      <Head>
        <title>{`DC32 ${selectedTagDetails?.label ?? ""} Events`}</title>
        <meta
          name="description"
          content={`DEF CON 32 ${selectedTagDetails?.label} Events`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div className="ml-2 md:ml-5 items-center grid bg-background mx-2 my-5 align-middle grid-cols-2 gap-1">
          <div>
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold font-mono ml-2">
              Schedule
            </h1>
          </div>

          <div className="justify-self-end align-middle flex">
            <span className="mr-5">
              <Select
                onValueChange={(e) => {
                  setSelectedTag(parseInt(e) ?? 0);
                  router.push(
                    {
                      pathname: "/events",
                      query: { tag: e },
                    },
                    undefined,
                    { shallow: true }
                  );
                }}
              >
                <SelectTrigger className="w-44 md:w-48">
                  <SelectValue
                    placeholder={selectedTagDetails?.label ?? "Select a tag"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="0">All events</SelectItem>
                  </SelectGroup>
                  {tags
                    .filter(
                      (tag) =>
                        tag.is_browsable &&
                        tag.tags.length > 0 &&
                        tag.category == "content"
                    )
                    .sort((a, b) => (a.sort_order > b.sort_order ? 1 : -1))
                    .map((tag) => (
                      <SelectGroup key={tag.id}>
                        <SelectLabel>{tag.label}</SelectLabel>
                        {tag.tags.map((t) => (
                          <SelectItem key={t.id} value={t.id.toString()}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                </SelectContent>
              </Select>
            </span>
            <Search dateGroup={dateGroup} />
          </div>
        </div>
        <div className="mb-5 place-content-center flex ">
          <Tabs
            value={day}
            defaultValue={day}
            onValueChange={(value) => {
              setDay(value);
            }}
          >
            <TabsList>
              {days.map((tabDay) => (
                <TabsTrigger value={tabDay} key={tabDay}>
                  <p className="text-xs md:text-sm">{tabDateTitle(tabDay)}</p>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="mb-10">
          <Table>
            <TableCaption>Events for DEF CON 32</TableCaption>
            <TableBody>
              {(dateGroup.get(day) ?? [])
                .filter(
                  (e) =>
                    selectedTag === 0 ||
                    e.tags?.some((t) => t.id == selectedTag)
                )
                .map((htEvent) => (
                  <EventCell key={htEvent.id} event={htEvent} />
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
