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

export const toCategories = (events: HTEvent[]): CategoryData[] => {
  const catDataMap = events.reduce((cats, e) => {
    cats.set(e.type.name, e.type);
    return cats;
  }, new Map<string, HTEventType>());

  let catData: CategoryData[] = Array.from(catDataMap.keys()).map((e) => ({
    name: e,
    data: catDataMap.get(e),
  }));

  return catData;
};
