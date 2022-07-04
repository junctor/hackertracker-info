interface EventProps {
  event: EventData;
  bookmarked: boolean;
}

interface EventDetailProps {
  event: HTEvent;
}

interface EventDetailHeaderProps {
  eventId: number;
}

interface ScheduleProps {
  events: EventData[];
  title: string;
}

interface EventHeadingProps {
  events: EventSearch[];
}

interface EventSearchProps {
  events: EventSearch[];
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
  dateGroup: Map<string, EventData[]>;
  title: string;
}

interface EventData {
  id: number;
  begin: string;
  beginTimestampSeconds: number;
  title: string;
  location: string;
  color: string;
  category: string;
}
