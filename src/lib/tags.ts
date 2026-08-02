import type { TagTypesBrowseView } from "@/lib/types/ht-types/views";

type SortableByOrderThenLabel = {
  label: string;
  sortOrder?: number;
};

type SortableTag = SortableByOrderThenLabel & {
  id: number;
};

export type TagSortOrders = ReadonlyMap<number, number>;

export function compareBySortOrderThenLabel(
  a: SortableByOrderThenLabel,
  b: SortableByOrderThenLabel,
): number {
  const aSortOrder = Number.isFinite(a.sortOrder) ? a.sortOrder! : Number.MAX_SAFE_INTEGER;
  const bSortOrder = Number.isFinite(b.sortOrder) ? b.sortOrder! : Number.MAX_SAFE_INTEGER;

  return aSortOrder - bSortOrder || a.label.localeCompare(b.label);
}

export function createTagSortOrders(tagTypes: TagTypesBrowseView): TagSortOrders {
  const sortOrders = new Map<number, number>();

  for (const tagType of tagTypes) {
    for (const tag of tagType.tags) {
      sortOrders.set(tag.id, tag.sortOrder);
    }
  }

  return sortOrders;
}

export function sortTags<T extends SortableTag>(
  tags: readonly T[],
  configuredSortOrders?: TagSortOrders,
): T[] {
  return [...tags].toSorted((a, b) =>
    compareBySortOrderThenLabel(
      {
        label: a.label,
        sortOrder: Number.isFinite(a.sortOrder) ? a.sortOrder : configuredSortOrders?.get(a.id),
      },
      {
        label: b.label,
        sortOrder: Number.isFinite(b.sortOrder) ? b.sortOrder : configuredSortOrders?.get(b.id),
      },
    ),
  );
}

export function sortTagTypes<T extends SortableByOrderThenLabel>(tagTypes: readonly T[]): T[] {
  return [...tagTypes].toSorted(compareBySortOrderThenLabel);
}
