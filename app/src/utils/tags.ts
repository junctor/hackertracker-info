export const getEventTags = (event: HTEvent, tags: HTTag[]) =>
  tags
    ?.flatMap((t) => t.tags)
    .filter((t) => event?.tag_ids.includes(t.id))
    .sort((a, b) => b.sort_order - a.sort_order) ?? [];

export const chunkTags = (tags: Tag[]) => {
  const chunks: Tag[][] = [[]];
  const size = 2;

  if (tags.length <= 2) {
    return [tags];
  }

  for (let i = 0; i < tags.length; i += size) {
    const chunk = tags.slice(i, i + size);
    chunks.push(chunk);
  }

  return chunks;
};
