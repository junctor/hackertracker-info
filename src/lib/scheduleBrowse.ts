import type { ScheduleBrowseView, ScheduleDayView } from "@/lib/types/ht-types";

export function bookmarkedScheduleDaysFromResource(
  browse: ScheduleBrowseView | undefined,
  bookmarkIds: readonly number[],
): ScheduleDayView[] {
  if (!browse || bookmarkIds.length === 0) return [];

  const selected = bookmarkIds
    .map((id) => browse.sessionPositionsById[String(id)])
    .filter((position) => Boolean(position))
    .toSorted((a, b) => a.dayIndex - b.dayIndex || a.sessionIndex - b.sessionIndex);
  const result: ScheduleDayView[] = [];

  for (const position of selected) {
    const sourceDay = browse.days[position.dayIndex];
    const session = sourceDay?.sessions[position.sessionIndex];
    if (!sourceDay || !session) continue;

    const currentDay = result.at(-1);
    if (currentDay?.day === sourceDay.day) {
      currentDay.sessions.push(session);
    } else {
      result.push({ day: sourceDay.day, sessions: [session] });
    }
  }

  return result;
}
