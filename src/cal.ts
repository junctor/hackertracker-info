import { HTEvent } from "./ht";

const iCalDesc = (event: HTEvent) => {
  const speakers = event.speakers.map((s) => s.name).join(", ");
  return `${event.description} - ${speakers}`;
};

const url = window.location.href.split("?")[0];

const iCalDate = (eDate: Date) => {
  const day = `0${eDate.getUTCDate()}`.slice(-2);
  const month = `0${eDate.getUTCMonth() + 1}`.slice(-2);
  const hour = `0${eDate.getUTCHours()}`.slice(-2);
  const min = `0${eDate.getUTCMinutes()}`.slice(-2);
  const secs = `0${eDate.getUTCSeconds()}`.slice(-2);
  return `${eDate.getUTCFullYear()}${month}${day}T${hour}${min}${secs}Z`;
};

export const generateCal = (event: HTEvent) =>
  `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hackertracker//${event.conferenceName} Calendar 1.0//EN
BEGIN:VEVENT
DTSTAMP:${iCalDate(new Date())}
UID:${event.id}
DTSTART:${iCalDate(new Date(event.begin))}
DTEND:${iCalDate(new Date(event.end))}
STATUS:CONFIRMED
CATEGORIES:CONFERENCE
SUMMARY:${event.title}
URL:${url}?event=${event.id}
LOCATION:${event.location.name}
DESCRIPTION:${iCalDesc(event).replace(/(\r\n|\n|\r)/gm, " ")}
END:VEVENT
END:VCALENDAR`
    .replaceAll("\n", "\r\n")
    .trim();

export default generateCal;
