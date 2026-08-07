import { contentPath } from "./routes";

type CalendarContent = {
  description?: string;
  id: number;
  title: string;
};

type CalendarSession = {
  begin: string;
  end: string;
  id: number;
};

const MAX_LINE_LEN = 75;
const CRLF = "\r\n";
const REPLACEMENT_CHAR = "\uFFFD";
const OBJECT_URL_REVOKE_DELAY_MS = 60_000;
const textEncoder = new TextEncoder();
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

/** Fold content lines at 75 UTF-8 octets, including continuation whitespace. */
const foldLine = (line: string) => {
  if (textEncoder.encode(line).length <= MAX_LINE_LEN) return line;

  const pieces: string[] = [];
  let chunk = "";
  let chunkOctets = 0;
  let contentLimit = MAX_LINE_LEN;

  for (const char of line) {
    const charOctets = textEncoder.encode(char).length;

    if (chunkOctets + charOctets > contentLimit) {
      pieces.push(pieces.length === 0 ? chunk : ` ${chunk}`);
      chunk = char;
      chunkOctets = charOctets;
      contentLimit = MAX_LINE_LEN - 1;
    } else {
      chunk += char;
      chunkOctets += charOctets;
    }
  }

  if (chunk) {
    pieces.push(pieces.length === 0 ? chunk : " " + chunk);
  }

  return pieces.join(CRLF);
};

export const createICalBlob = (ics: string) =>
  new Blob([ics], {
    type: "text/calendar;charset=utf-8",
  });

/** Open an iCalendar file from a direct user action. */
export const openICal = (ics: string, filename: string) => {
  const blob = createICalBlob(ics);
  const objectUrl = URL.createObjectURL(blob);
  let anchor: HTMLAnchorElement | undefined;

  try {
    anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.append(anchor);
    anchor.click();
  } finally {
    anchor?.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), OBJECT_URL_REVOKE_DELAY_MS);
  }
};

/** Generate a full iCal string for a session */
export const generateICal = (
  conferenceSlug: string,
  content: CalendarContent,
  session: CalendarSession,
  locationName?: string,
): string => {
  const start = new Date(session.begin);
  const end = new Date(session.end);

  if (Number.isNaN(start.getTime())) {
    throw new RangeError("Calendar session start date is invalid.");
  }
  if (Number.isNaN(end.getTime())) {
    throw new RangeError("Calendar session end date is invalid.");
  }
  if (end.getTime() < start.getTime()) {
    throw new RangeError("Calendar session end date cannot be earlier than its start date.");
  }

  const dtstamp = formatICalDate(new Date());
  const dtstart = formatICalDate(start);
  const dtend = formatICalDate(end);
  const uid = `defcon-${content.id}-${session.id}@info.defcon.org`;
  const summary = escapeICalText(content.title);
  const description = escapeICalText(content.description ?? "");
  const location = escapeICalText(locationName ?? "");
  const url = `https://info.defcon.org${contentPath(conferenceSlug, content.id)}`;

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

export const addSessionToCalendar = (
  conferenceSlug: string,
  content: CalendarContent,
  session: CalendarSession,
  locationName: string | undefined,
  filename: string,
  setStatus: (status: string) => void,
) => {
  const ics = generateICal(conferenceSlug, content, session, locationName);
  openICal(ics, filename);
  setStatus("Calendar file opened.");
};

export default generateICal;
