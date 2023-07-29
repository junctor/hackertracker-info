export const getEventTags = (event: HTEvent, tags: HTTag[]) =>
  tags
    ?.flatMap((t) => t.tags)
    .filter((t) => event?.tag_ids.includes(t.id))
    .sort((a, b) => b.sort_order - a.sort_order) ?? [];
