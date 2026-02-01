import React, { useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import PeopleList from "@/features/people/PeopleList";
import PersonDetails from "@/features/people/PersonDetails";
import Head from "next/head";
import { ConferenceManifest } from "@/lib/conferences";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import type { GetStaticProps } from "next";
import { PageId } from "@/lib/types/page-meta";
import { PeopleCardsView } from "@/lib/types/ht-types/views";
import {
  EventsStore,
  LocationsStore,
  PeopleStore,
  PersonEntity,
} from "@/lib/types/ht-types";
import { useRouter } from "next/router";
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

  const shouldLoadDetails =
    isReady && !isIdMissing && !isIdInvalid && personId !== null;
  const shouldLoadList = isReady && isIdMissing;

  const {
    data: people,
    error,
    isLoading,
  } = useSWR<PeopleCardsView>(
    shouldLoadList ? `${conf.dataRoot}/views/peopleCards.json` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  const {
    data: peopleStore,
    error: peopleError,
    isLoading: peopleLoading,
  } = useSWR<PeopleStore>(
    shouldLoadDetails ? `${conf.dataRoot}/entities/people.json` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  const {
    data: events,
    error: eventsError,
    isLoading: eventsLoading,
  } = useSWR<EventsStore>(
    shouldLoadDetails ? `${conf.dataRoot}/entities/events.json` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  const {
    data: locations,
    error: locationsError,
    isLoading: locationsLoading,
  } = useSWR<LocationsStore>(
    shouldLoadDetails ? `${conf.dataRoot}/entities/locations.json` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  const person: PersonEntity | null = useMemo(() => {
    if (!peopleStore || personId === null) return null;
    return peopleStore.byId[personId] ?? null;
  }, [peopleStore, personId]);

  const personContentIds = useMemo(
    () => (person ? person.contentIds : []),
    [person],
  );

  const eventForContentIds = useMemo(() => {
    if (!events || personContentIds.length === 0) return [];
    const contentIdsSet = new Set(personContentIds);
    return Object.values(events.byId).filter((e) =>
      contentIdsSet.has(e.contentId),
    );
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
    const base =
      rawDescription && rawDescription.length > 0 ? rawDescription : fallback;
    const normalized = base.replace(/\s+/g, " ").trim();
    if (normalized.length === 0) return fallback;
    if (normalized.length <= 150) return normalized;
    return `${normalized.slice(0, 147).trimEnd()}...`;
  }, [person, conf.name]);

  if (!isReady) return <LoadingScreen />;
  if (isIdInvalid) return <ErrorScreen msg="Invalid person id." />;

  if (shouldLoadDetails) {
    const isDetailLoading = peopleLoading || eventsLoading || locationsLoading;
    const detailError = peopleError || eventsError || locationsError;

    if (isDetailLoading) return <LoadingScreen />;
    if (detailError || !peopleStore || !events || !locations) {
      return <ErrorScreen />;
    }
    if (!person) return <ErrorScreen msg="Person not found." />;

    return (
      <>
        <Head>
          <title>
            {person.name} | {conf.name}
          </title>
          <meta name="description" content={metaDescription} />
        </Head>
        <SiteHeader conference={conf} activePageId={activePageId} />
        <main>
          <PersonDetails
            person={person}
            events={eventForContentIds}
            locations={locationsForEventIds}
            conference={conf}
          />
        </main>
      </>
    );
  }

  if (isLoading) return <LoadingScreen />;
  if (error || !people) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>People | {conf.name}</title>
        <meta
          name="description"
          content={`Browse bios and sessions for all ${conf.name} participants.`}
        />
      </Head>
      <SiteHeader conference={conf} activePageId={activePageId} />
      <main>
        <PeopleList people={people} conference={conf} />
      </main>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<PeoplePageProps> = async (ctx) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "people" } };
};
