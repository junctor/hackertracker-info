interface EventProps {
  event: HTEvent;
  bookmarks: string[];
}

interface EventDetailProps {
  event: HTEvent;
}

interface ScheduleProps {
  events: HTEvent[];
}

interface EventsProps {
  dateGroup: Map<string, HTEvent[]>;
}
