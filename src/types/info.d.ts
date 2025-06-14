interface Timer {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
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

interface EventData {
  id: number;
  begin: string;
  beginTimestampSeconds: number;
  endTimestampSeconds: number;
  end: string;
  title: string;
  location: string;
  color: string;
  category: string;
  tags: HTTags[];
  speakers: string | null;
}

interface CategoryData {
  name: string;
  data: HTEventType | undefined;
}

interface Speaker {
  name: string;
  id: number;
}
