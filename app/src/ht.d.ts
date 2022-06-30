interface EventProps {
  event: HTEvent;
  bookmarked: boolean;
}

interface EventDetailProps {
  event: HTEvent;
}

interface ScheduleProps {
  events: HTEvent[];
  title: string;
}

interface EventHeadingProps {
  events: EventSearch[];
  title: string;
}

interface EventSearching {
  event: EventSearch;
  active: boolean;
}

interface EventSearch {
  id: number;
  title: string;
  color: string;
}

interface EventsProps {
  dateGroup: Map<string, HTEvent[]>;
}
