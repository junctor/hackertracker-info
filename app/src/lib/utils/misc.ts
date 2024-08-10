export const fetcher = async (...args: Parameters<typeof fetch>) =>
  await fetch(...args).then(async (res) => await res.json());

export const toEventsData = (events: HTEvent[], tags: HTTag[]): EventData[] => {
  const formatter = new Intl.ListFormat("en", {
    style: "long",
    type: "conjunction",
  });

  const allTags = tags?.flatMap((t) => t.tags) ?? [];

  return events.map((e) => ({
    id: e.id,
    begin: e.begin,
    beginTimestampSeconds: e.begin_timestamp.seconds,
    end: e.end,
    endTimestampSeconds: e.end_timestamp.seconds,
    title: e.title,
    location: e.location.name,
    color: e.type.color,
    category: e.type.name,
    tags: (e.tag_ids
      .map((t) => allTags.find((a) => a.id === t))
      .filter((tag) => tag !== undefined) ?? []) as HTTags[],
    speakers: formatter.format(e.speakers.map((s) => s.name)),
  }));
};

export const displayConference = (
  code: string | null,
  conferences: HTConference[]
) => {
  if (code != null || code !== "") {
    const findConfByCode = conferences.find(
      (c) => c.code.toString().toLowerCase() === code?.toLowerCase()
    );
    if (findConfByCode !== undefined) {
      return findConfByCode;
    }
  }

  const findConfByDate = sortConferences(conferences);

  return findConfByDate[0];
};

export function sortConferences(conferences: HTConference[]): HTConference[] {
  const now = new Date().getTime() / 1000;

  return conferences.sort(
    (a, b) =>
      Math.abs(now - a.start_timestamp.seconds) -
      Math.abs(now - b.start_timestamp.seconds)
  );
}

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
