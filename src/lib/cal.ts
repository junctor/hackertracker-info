import { ContentEntity, EventEntity } from "@/lib/types/ht-types";

const MAX_LINE_LEN = 75;
const CRLF = "\r\n";
const pad2 = (n: number) => String(n).padStart(2, "0");

/** Escape special chars per RFC 5545 */
const escapeICalText = (text = "") =>
  text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

/** Format a UTC Date to iCal “YYYYMMDDTHHMMSSZ” */
const formatICalDate = (d: Date) => {
  return (
    d.getUTCFullYear() +
    pad2(d.getUTCMonth() + 1) +
    pad2(d.getUTCDate()) +
    "T" +
    pad2(d.getUTCHours()) +
    pad2(d.getUTCMinutes()) +
    pad2(d.getUTCSeconds()) +
    "Z"
  );
};

/** Fold long lines with a space prefix on continuations */
const foldLine = (line: string) => {
  if (line.length <= MAX_LINE_LEN) return line;
  const pieces: string[] = [];
  for (let pos = 0; pos < line.length; pos += MAX_LINE_LEN) {
    const chunk = line.slice(pos, pos + MAX_LINE_LEN);
    pieces.push(pos === 0 ? chunk : " " + chunk);
  }
  return pieces.join(CRLF);
};

/** Generate a full iCal string for an event */
export const generateICal = (
  conferenceSlug: string,
  content: ContentEntity,
  session: EventEntity,
  locationName?: string,
): string => {
  const dtstamp = formatICalDate(new Date());
  const dtstart = formatICalDate(new Date(session.begin));
  const dtend = formatICalDate(new Date(session.end));
  const uid = `defcon-${content.id}-${session.id}@info.defcon.org`;
  const summary = escapeICalText(content.title);
  const description = escapeICalText(content.description ?? "");
  const location = escapeICalText(locationName ?? "");
  const url = `https://info.defcon.org/${conferenceSlug}/content?id=${content.id}`;

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "METHOD:PUBLISH",
    "VERSION:2.0",
    `PRODID:-//hackertracker//${conferenceSlug} Calendar 1.0//EN`,
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `SEQUENCE:0`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    "STATUS:CONFIRMED",
    "CATEGORIES:CONFERENCE",
    `SUMMARY:${summary}`,
    `URL:${url}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  if (lines.length === 0) return "";
  let out = foldLine(lines[0]);
  for (let i = 1; i < lines.length; i += 1) {
    out += CRLF + foldLine(lines[i]);
  }
  return out;
};

export default generateICal;
