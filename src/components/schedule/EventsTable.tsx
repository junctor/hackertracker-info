import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { eventDayTable, tabDateTitle } from "@/lib/dates";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead as HeadCell,
} from "@/components/ui/table";
import EventCell from "./EventCell";
import { Button } from "@/components/ui/button";

interface Props {
  dateGroup: Record<string, EventData[]>;
}

export default function EventsTable({ dateGroup }: Props) {
  const TAB_TOP = 60;
  const TAB_HEIGHT = 56;
  const SCROLL_OFFSET = TAB_TOP + TAB_HEIGHT; // 116

  const days = useMemo(
    () => Object.entries(dateGroup).map(([day, events]) => ({ day, events })),
    [dateGroup]
  );

  const dayRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeDay, setActiveDay] = useState<string>(days[0]?.day || "");

  // IntersectionObserver for active tabs
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveDay(entry.target.getAttribute("data-day")!);
          }
        });
      },
      {
        rootMargin: `-${SCROLL_OFFSET}px 0px 0px 0px`,
        threshold: 0,
      }
    );
    Object.values(dayRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [days]);

  const scrollToDay = useCallback((day: string) => {
    const el = dayRefs.current[day];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* Sticky day tabs */}
      <div className="sticky top-[60px] bg-background z-30 flex flex-wrap justify-center gap-1 py-2">
        {days.map(({ day }) => (
          <Button
            key={day}
            className="mx-1"
            variant={activeDay === day ? "secondary" : "outline"}
            onClick={() => scrollToDay(day)}
            aria-current={activeDay === day ? "date" : undefined}
          >
            {tabDateTitle(day)}
          </Button>
        ))}
      </div>

      {days.map(({ day, events }) => (
        <section key={day}>
          <h2
            ref={(el) => {
              dayRefs.current[day] = el;
            }}
            data-day={day}
            className="scroll-mt-[116px] font-bold text-lg md:text-xl ml-5 mt-4 mb-2"
          >
            {eventDayTable(day)}
          </h2>

          <div className="overflow-x-auto">
            <Table className="w-full mb-8 table-fixed min-w-full">
              <colgroup>
                <col className="w-1/12 min-w-0" /> {/* color bar */}
                <col className="w-2/12 min-w-0" /> {/* time */}
                <col className="w-8/12 min-w-0" /> {/* event */}
                <col className="w-1/12 min-w-0" /> {/* bookmark */}
              </colgroup>

              <TableHeader className="bg-background">
                <TableRow>
                  <HeadCell />
                  <HeadCell className="font-extrabold">Time</HeadCell>
                  <HeadCell className="font-extrabold">Event</HeadCell>
                  <HeadCell />
                </TableRow>
              </TableHeader>

              <TableBody>
                {events.map((evt) => (
                  <EventCell key={evt.id} event={evt} />
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      ))}
    </>
  );
}
