export const fetcher = async (...args: Parameters<typeof fetch>) =>
  await fetch(...args).then(async (res) => await res.json());

export const toEventsData = (events: HTEvent[]): EventData[] => {
  const formatter = new Intl.ListFormat("en", {
    style: "long",
    type: "conjunction",
  });

  return events.map((e) => ({
    id: e.id,
    begin: e.begin,
    beginTimestampSeconds: e.begin_timestamp.seconds,
    end: e.end,
    title: e.title,
    location: e.location.name,
    color: e.type.color,
    category: e.type.name,
    speakers: formatter.format(e.speakers.map((s) => s.name)),
  }));
};

export const toTVData = (events: HTEvent[]): TVEventData[] => {
  const formatter = new Intl.ListFormat("en", {
    style: "long",
    type: "conjunction",
  });

  return events.map((e) => ({
    id: e.id,
    begin: e.begin,
    beginTimestampSeconds: e.begin_timestamp.seconds,
    end: e.end,
    title: e.title,
    location: e.location.name,
    color: e.type.color,
    category: e.type.name,
    speakers: formatter.format(e.speakers.map((s) => s.name)),
    tags: e.tag_ids,
  }));
};

export const toCategories = (events: HTEvent[]): CategoryData[] => {
  const catDataMap = events.reduce((cats, e) => {
    cats.set(e.type.name, e.type);
    return cats;
  }, new Map<string, HTEventType>());

  const catData: CategoryData[] = Array.from(catDataMap.keys())?.map((e) => ({
    name: e,
    data: catDataMap.get(e),
  }));

  return catData;
};

export const toSpeakers = (events: HTSpeaker[]): Speaker[] => {
  const speakerDataMap = events.reduce((speakers, s) => {
    speakers.set(s.name, s);
    return speakers;
  }, new Map<string, HTSpeaker>());

  const speakerData: Speaker[] = Array.from(speakerDataMap.keys()).map((e) => ({
    name: e,
    id: speakerDataMap.get(e)?.id ?? 0,
  }));

  return speakerData;
};

const sortSpeakers = (a: Speaker, b: Speaker) => {
  if (a.name.toLowerCase() > b.name.toLowerCase()) {
    return 1;
  }

  if (a.name.toLowerCase() < b.name.toLowerCase()) {
    return -1;
  }

  return 0;
};

const groupedSpeakers = (speakers: Speaker[]): Map<string, Speaker[]> =>
  speakers.sort(sortSpeakers).reduce((group, s) => {
    const firstLetter = s.name.toLowerCase()[0] ?? "";
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
