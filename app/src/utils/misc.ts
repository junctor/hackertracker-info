export const toEventsData = (events: HTEvent[]): EventData[] =>
  events.map((e) => ({
    id: e.id,
    begin: e.begin,
    beginTimestampSeconds: e.begin_timestamp.seconds,
    title: e.title,
    location: e.location.name,
    color: e.type.color,
    category: e.type.name,
  }));
