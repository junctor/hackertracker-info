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
import { GroupedSchedule } from "@/types/info";

interface Props {
  dateGroup: GroupedSchedule;
}

export default function EventsTable({ dateGroup }: Props) {
  const TAB_TOP = 60;
  const TAB_HEIGHT = 56;
  const SCROLL_OFFSET = TAB_TOP + TAB_HEIGHT;

  const days = useMemo(
    () => Object.entries(dateGroup).map(([day, events]) => ({ day, events })),
    [dateGroup]
  );
  const dayRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeDay, setActiveDay] = useState<string>(days[0]?.day || "");

  // track which section is in view
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
  }, [days, SCROLL_OFFSET]);

  const scrollToDay = useCallback(
    (day: string) => {
      const el = dayRefs.current[day];
      if (!el) return;
      const top =
        el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    },
    [SCROLL_OFFSET]
  );

  return (
    <div className="min-h-screen text-gray-100">
      {/* Sticky day tabs */}
      <div className="sticky top-[60px] bg-background z-30 flex flex-wrap justify-center gap-2 py-2 border-b border-gray-700">
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
            className="scroll-mt-[116px] font-bold text-xl md:text-2xl ml-5 mt-6 mb-3 text-gray-100"
          >
            {eventDayTable(day)}
          </h2>

          <div className="overflow-x-auto px-5">
            <Table className="w-full mb-8 table-fixed min-w-full">
              <colgroup>
                <col className="w-1/12 min-w-0" />
                <col className="w-2/12 min-w-0" />
                <col className="w-8/12 min-w-0" />
                <col className="w-1/12 min-w-0" />
              </colgroup>

              <TableHeader className="bg-gray-800">
                <TableRow>
                  <HeadCell />
                  <HeadCell className="font-extrabold text-gray-100">
                    Time
                  </HeadCell>
                  <HeadCell className="font-extrabold text-gray-100">
                    Event
                  </HeadCell>
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
    </div>
  );
}
