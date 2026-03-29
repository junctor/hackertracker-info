import type { GetStaticProps } from "next";

import Head from "next/head";
import { useRouter } from "next/router";
import React, { useMemo, type ReactElement } from "react";

import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import SiteFooter from "@/features/app-shell/SiteFooter";
import SiteHeader from "@/features/app-shell/SiteHeader";
import PeopleList from "@/features/people/PeopleList";
import PersonDetails from "@/features/people/PersonDetails";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { buildConferenceStaticPaths, getConferenceFromParams } from "@/lib/next-static";
import { EventsStore, LocationsStore, PeopleStore, PersonEntity } from "@/lib/types/ht-types";
import { PeopleCardsView } from "@/lib/types/ht-types/views";
import { PageId } from "@/lib/types/page-meta";
import useNumericQueryParam from "@/lib/utils/useNumericQueryParam";

type PeoplePageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function PeoplePage({ conf, activePageId }: PeoplePageProps) {
  const router = useRouter();
  const {
    value: personId,
    isReady,
    isMissing: isIdMissing,
    isInvalid: isIdInvalid,
  } = useNumericQueryParam(router, "id");

  const shouldLoadDetails = isReady && !isIdMissing && !isIdInvalid && personId !== null;
  const shouldLoadList = isReady && isIdMissing;

  const {
    data: people,
    error,
    isLoading,
  } = useConferenceJson<PeopleCardsView>(conf, shouldLoadList ? "views/peopleCards.json" : null);

  const {
    data: peopleStore,
    error: peopleError,
    isLoading: peopleLoading,
  } = useConferenceJson<PeopleStore>(conf, shouldLoadDetails ? "entities/people.json" : null);

  const {
    data: events,
    error: eventsError,
    isLoading: eventsLoading,
  } = useConferenceJson<EventsStore>(conf, shouldLoadDetails ? "entities/events.json" : null);

  const {
    data: locations,
    error: locationsError,
    isLoading: locationsLoading,
  } = useConferenceJson<LocationsStore>(conf, shouldLoadDetails ? "entities/locations.json" : null);

  const person: PersonEntity | null = useMemo(() => {
    if (!peopleStore || personId === null) return null;
    return peopleStore.byId[personId] ?? null;
  }, [peopleStore, personId]);

  const personContentIds = useMemo(() => (person ? person.contentIds : []), [person]);

  const eventForContentIds = useMemo(() => {
    if (!events || personContentIds.length === 0) return [];
    const contentIdsSet = new Set(personContentIds);
    return Object.values(events.byId).filter((e) => contentIdsSet.has(e.contentId));
  }, [events, personContentIds]);

  const locationIdsForEvents = useMemo(() => {
    if (eventForContentIds.length === 0) return new Set<number>();
    return new Set(eventForContentIds.map((event) => event.locationId));
  }, [eventForContentIds]);

  const locationsForEventIds = useMemo(() => {
    if (!locations || locationIdsForEvents.size === 0) return [];
    return Object.values(locations.byId).filter((location) =>
      locationIdsForEvents.has(location.id),
    );
  }, [locations, locationIdsForEvents]);

  const metaDescription = useMemo(() => {
    const fallback = `Learn more about ${person?.name ?? "this person"} at ${conf.name}.`;
    const rawDescription = person?.description?.trim();
    const base = rawDescription && rawDescription.length > 0 ? rawDescription : fallback;
    const normalized = base.replace(/\s+/g, " ").trim();
    if (normalized.length === 0) return fallback;
    if (normalized.length <= 150) return normalized;
    return `${normalized.slice(0, 147).trimEnd()}...`;
  }, [person, conf.name]);

  if (!isReady) return <LoadingScreen />;
  if (isIdInvalid) return <ErrorScreen msg="Invalid person id." />;

  let pageTitle = `People | ${conf.name}`;
  let pageDescription = `Speaker profiles and sessions for ${conf.name}.`;
  let pageContent: ReactElement;

  if (shouldLoadDetails) {
    const isDetailLoading = peopleLoading || eventsLoading || locationsLoading;
    const detailError = peopleError || eventsError || locationsError;

    if (isDetailLoading) return <LoadingScreen />;
    if (detailError || !peopleStore || !events || !locations) {
      return <ErrorScreen />;
    }
    if (!person) return <ErrorScreen msg="Person not found." />;

    pageTitle = `${person.name} | ${conf.name}`;
    pageDescription = metaDescription;
    pageContent = (
      <PersonDetails
        person={person}
        events={eventForContentIds}
        locations={locationsForEventIds}
        conference={conf}
      />
    );
  } else {
    if (isLoading) return <LoadingScreen />;
    if (error || !people) return <ErrorScreen />;
    pageContent = <PeopleList people={people} conference={conf} />;
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>
      <div className="ui-page-shell">
        <SiteHeader conference={conf} activePageId={activePageId} />
        <main id="main-content" className="ui-page-main">
          {pageContent}
        </main>
        <SiteFooter />
      </div>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<PeoplePageProps> = async (ctx) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "people" } };
};
