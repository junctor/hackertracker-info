interface EventProps {
  event: HTEvent;
  bookmarks: string[];
}

interface EventDetailProps {
  event: HTEvent;
}

interface ScheduleProps {
  dateGroup: [string, HTEvent[]][];
}

interface EventsProps {
  dateGroup: [string, HTEvent[]][];
}
