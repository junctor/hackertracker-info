export const fetcher = async (...args: Parameters<typeof fetch>) =>
  await fetch(...args).then(async (res) => await res.json());

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
