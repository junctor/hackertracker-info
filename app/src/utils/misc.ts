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

export const toSpeakers = (events: HTEvent[]): Speaker[] => {
  const speakerDataMap = events
    .flatMap((e) => e.speakers)
    .reduce((speakers, s) => {
      speakers.set(s.name, s);
      return speakers;
    }, new Map<string, HTSpeaker>());

  let speakerData: Speaker[] = Array.from(speakerDataMap.keys()).map((e) => ({
    name: e,
    id: speakerDataMap.get(e)?.id ?? 0,
  }));

  return speakerData;
};

const groupedSpeakers = (speakers: Speaker[]): Map<string, Speaker[]> =>
  speakers.sort(sortSpeakers).reduce((group, s) => {
    let firstLetter = s.name.toLowerCase()[0] ?? "";
    const iSpeakers = group.get(firstLetter) ?? [];
    iSpeakers.push(s);
    group.set(firstLetter, iSpeakers);
    return group;
  }, new Map<string, Speaker[]>());

export const createSpeakerGroup = (speakers: Speaker[]) =>
  new Map(
    Array.from(groupedSpeakers(speakers)).map(([d, et]) => [
      d,
      et.sort(sortSpeakers),
    ])
  );

const sortSpeakers = (a: Speaker, b: Speaker) => {
  if (a.name.toLowerCase() > b.name.toLowerCase()) {
    return 1;
  }

  if (a.name.toLowerCase() < b.name.toLowerCase()) {
    return -1;
  }

  return 0;
};
