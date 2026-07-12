import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import type { ConferenceManifest } from "@/lib/conferences";
import type {
  ContentCardsView,
  ContentDetailView,
  ContentDetailsById,
  TagEntity,
} from "@/lib/types/ht-types";

import { CONFERENCES } from "@/lib/conferences";
import { resolveRelatedContentCards } from "@/routes/conference/ContentPage";

import ContentDetails from "./ContentDetails";
import ContentList from "./ContentList";

const conference: ConferenceManifest = CONFERENCES.defcon33;

function tag(id: number, label = `Tag ${id}`): TagEntity {
  return {
    colorBackground: "#123456",
    colorForeground: "#ffffff",
    id,
    label,
    sortOrder: id,
    tagTypeId: 1,
  };
}

function detail(
  id: number,
  title: string,
  options: {
    relatedContentIds?: number[];
    tags?: TagEntity[];
  } = {},
): ContentDetailView {
  return {
    content: {
      id,
      relatedContentIds: options.relatedContentIds,
      tagIds: options.tags?.map((item) => item.id) ?? [],
      title,
    },
    locations: [],
    people: [],
    sessions: [],
    tags: options.tags ?? [],
  };
}

function detailsById(items: ContentDetailView[]): ContentDetailsById {
  return Object.fromEntries(items.map((item) => [String(item.content.id), item]));
}

function renderWithRouter(element: React.ReactElement) {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={["/defcon33/content/?id=1"]}>{element}</MemoryRouter>,
  );
}

function renderDetails(relatedContent: ContentCardsView, people = detail(1, "Current").people) {
  return renderWithRouter(
    <ContentDetails
      content={{ id: 1, tagIds: [], title: "Current Content" }}
      sessions={[]}
      locations={[]}
      people={people}
      tags={[]}
      relatedContent={relatedContent}
      bookmarks={[]}
      conference={conference}
    />,
  );
}

describe("related content resolution", () => {
  it("preserves related ID order and ignores unknown, duplicate, and self references", () => {
    const current = detail(1, "Current", {
      relatedContentIds: [3, 999, 2, 3, 1, 4],
    });
    const related = resolveRelatedContentCards(
      current,
      detailsById([
        current,
        detail(2, "Second", { tags: [tag(20)] }),
        detail(3, "First", { tags: [tag(30)] }),
        detail(4, "Third"),
      ]),
    );

    expect(related.map((item) => item.id)).toEqual([3, 2, 4]);
    expect(related.map((item) => item.title)).toEqual(["First", "Second", "Third"]);
    expect(related[0].tags[0]?.label).toBe("Tag 30");
  });

  it("returns no cards when related IDs are empty", () => {
    const current = detail(1, "Current", { relatedContentIds: [] });

    expect(resolveRelatedContentCards(current, detailsById([current]))).toEqual([]);
  });

  it("returns no cards when related IDs are missing", () => {
    const current = detail(1, "Current");

    expect(resolveRelatedContentCards(current, detailsById([current]))).toEqual([]);
  });

  it("omits the section when none of the related IDs can be resolved", () => {
    const current = detail(1, "Current", { relatedContentIds: [404, 405] });
    const related = resolveRelatedContentCards(current, detailsById([current]));

    expect(related).toEqual([]);
    expect(renderDetails(related)).not.toContain("Related Content");
  });

  it("renders long related lists without truncating cards", () => {
    const relatedIds = Array.from({ length: 25 }, (_, index) => index + 2);
    const current = detail(1, "Current", { relatedContentIds: relatedIds });
    const map = detailsById([current, ...relatedIds.map((id) => detail(id, `Related ${id}`))]);
    const related = resolveRelatedContentCards(current, map);
    const html = renderDetails(related);

    expect(related).toHaveLength(25);
    expect(html).toContain("Related 2");
    expect(html).toContain("Related 26");
  });
});

describe("ContentDetails related content", () => {
  it("renders related content after people with expected titles, links, and order", () => {
    const html = renderDetails(
      [
        { id: 3, tags: [tag(3, "Alpha")], title: "First Related" },
        { id: 2, tags: [], title: "Second Related" },
      ],
      [{ contentIds: [1], id: 10, name: "Speaker One" }],
    );

    expect(html).toContain("Related Content");
    expect(html.indexOf("People")).toBeLessThan(html.indexOf("Related Content"));
    expect(html.indexOf("First Related")).toBeLessThan(html.indexOf("Second Related"));
    expect(html).toContain('href="/defcon33/content/?id=3"');
    expect(html).toContain('href="/defcon33/content/?id=2"');
  });

  it("does not render related content when the resolved collection is empty", () => {
    expect(renderDetails([])).not.toContain("related-content-title");
  });
});

describe("ContentList cards", () => {
  it("continues to render content cards after shared card extraction", () => {
    const html = renderWithRouter(
      <ContentList
        content={[{ id: 42, tags: [tag(42, "Tool")], title: "List Item" }]}
        tags={[]}
        conference={conference}
      />,
    );

    expect(html).toContain("List Item");
    expect(html).toContain("Tool");
    expect(html).toContain('href="/defcon33/content/?id=42"');
  });
});
