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

interface CategoriesProps {
  categories: CategoryData[];
}

interface CategoryData {
  name: string;
  data: HTEventType | undefined;
}

interface CategoryCellProps {
  category: HTEventType;
}

interface CategoryPageProps {
  category: string;
  events: EventData[];
}

interface SpeakersProps {
  speakers: Speaker[];
}

interface Speaker {
  name: string;
  id: number;
}

interface SpeakerListProps {
  speakerGroup: Map<string, Speaker[]>;
}

interface SpeakerSearching {
  speaker: Speaker;
  active: boolean;
}
