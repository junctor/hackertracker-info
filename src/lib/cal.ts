import { ContentEntity, SessionEntity } from "@/lib/types/ht-types";

const MAX_LINE_LEN = 75;
const CRLF = "\r\n";
const REPLACEMENT_CHAR = "\uFFFD";
const pad2 = (n: number) => String(n).padStart(2, "0");

const toWellFormedText = (text: string) => {
  let out = "";

  for (let i = 0; i < text.length; i += 1) {
    const current = text.charCodeAt(i);

    if (current >= 0xd800 && current <= 0xdbff) {
      const next = text.charCodeAt(i + 1);

      if (next >= 0xdc00 && next <= 0xdfff) {
        out += text[i] + text[i + 1];
        i += 1;
      } else {
        out += REPLACEMENT_CHAR;
      }
    } else if (current >= 0xdc00 && current <= 0xdfff) {
      out += REPLACEMENT_CHAR;
    } else {
      out += text[i];
    }
  }

  return out;
};

/** Escape special chars per RFC 5545 */
const escapeICalText = (text = "") =>
  toWellFormedText(text)
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

  let chunk = "";
  for (const char of line) {
    if (chunk.length + char.length > MAX_LINE_LEN) {
      pieces.push(pieces.length === 0 ? chunk : " " + chunk);
      chunk = "";
    }

    chunk += char;
  }

  if (chunk) {
    pieces.push(pieces.length === 0 ? chunk : " " + chunk);
  }

  return pieces.join(CRLF);
};

export const encodeICalDataUri = (ics: string) =>
  `data:text/calendar;charset=utf8,${encodeURIComponent(toWellFormedText(ics))}`;

/** Generate a full iCal string for a session */
export const generateICal = (
  conferenceSlug: string,
  content: ContentEntity,
  session: SessionEntity,
  locationName?: string,
): string => {
  const dtstamp = formatICalDate(new Date());
  const dtstart = formatICalDate(new Date(session.begin));
  const dtend = formatICalDate(new Date(session.end));
  const uid = `defcon-${content.id}-${session.id}@info.defcon.org`;
  const summary = escapeICalText(content.title);
  const description = escapeICalText(content.description ?? "");
  const location = escapeICalText(locationName ?? "");
  const url = `https://info.defcon.org/${conferenceSlug}/content/?id=${content.id}`;

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
