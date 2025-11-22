import { ContentSessionLite, ProcessedContentId } from "@/types/info";

const BASEURL = "https://info.defcon.org";
const PRODID = "-//hackertracker//defcon-singapore-2025 Calendar 1.0//EN";
const MAX_LINE_LEN = 75;

/** Escape special chars per RFC 5545 */
const escapeICalText = (text = "") =>
  text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

/** Format a UTC Date to iCal “YYYYMMDDTHHMMSSZ” */
const formatICalDate = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
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
  return pieces.join("\r\n");
};

/** Build a plain-text description including speakers */
const buildDescription = (content: ProcessedContentId) => {
  const speakers = content.people.map((s) => s.name).join(", ");
  return [content.description, speakers].filter(Boolean).join("\\n");
};

/** Generate a full iCal string for an event */
export const generateICal = (
  content: ProcessedContentId,
  session: ContentSessionLite
): string => {
  const now = new Date();
  const dtstamp = formatICalDate(now);
  const dtstart = formatICalDate(new Date(session.begin_tsz));
  const dtend = formatICalDate(new Date(session.end_tsz));
  const uid = `defcon-singapore-2025-${content.id}@info.defcon.org`;

  const lines = [
    "BEGIN:VCALENDAR",
    "METHOD:PUBLISH",
    "VERSION:2.0",
    `PRODID:${PRODID}`,
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `SEQUENCE:0`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    "STATUS:CONFIRMED",
    "CATEGORIES:CONFERENCE",
    `SUMMARY:${escapeICalText(content.title)}`,
    `URL:${BASEURL}/content?id=${content.id}`,
    `LOCATION:${escapeICalText(session.location_name ?? "")}`,
    `DESCRIPTION:${escapeICalText(buildDescription(content))}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  // fold and join
  return lines.map(foldLine).join("\r\n");
};

export default generateICal;
