import React, { lazy, useMemo, type ReactElement } from "react";

import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import PeopleList from "@/features/people/PeopleList";
import { aiMetadata, conferenceDataFeeds, conferencePath } from "@/lib/aiMetadata";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { PeopleCardsView, PersonDetailView } from "@/lib/types/ht-types/views";
import { PageId } from "@/lib/types/page-meta";
import useNumericQueryParam from "@/lib/utils/useNumericQueryParam";

type PeoplePageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

const PersonDetails = lazy(() => import("@/features/people/PersonDetails"));

export default function PeoplePage({ conf, activePageId }: PeoplePageProps) {
  const {
    value: personId,
    isReady,
    isMissing: isIdMissing,
    isInvalid: isIdInvalid,
  } = useNumericQueryParam("id");

  const shouldLoadDetails = isReady && !isIdMissing && !isIdInvalid && personId !== null;
  const shouldLoadList = isReady && isIdMissing;

  const {
    data: people,
    error,
    isLoading,
  } = useConferenceJson<PeopleCardsView>(conf, shouldLoadList ? "views/peopleCards.json" : null);

  const {
    data: personDetail,
    error: personDetailError,
    isLoading: personDetailLoading,
  } = useConferenceJson<PersonDetailView>(
    conf,
    shouldLoadDetails && personId !== null ? `details/people/${personId}.json` : null,
  );

  const metaDescription = useMemo(() => {
    const fallback = `Learn more about ${personDetail?.person.name ?? "this person"} at ${conf.name}.`;
    const rawDescription = personDetail?.person.description?.trim();
    const base = rawDescription && rawDescription.length > 0 ? rawDescription : fallback;
    const normalized = base.replace(/\s+/g, " ").trim();
    if (normalized.length === 0) return fallback;
    if (normalized.length <= 150) return normalized;
    return `${normalized.slice(0, 147).trimEnd()}...`;
  }, [personDetail, conf.name]);

  if (!isReady) return <LoadingScreen />;
  if (isIdInvalid) return <ErrorScreen msg="Invalid person id." />;

  let pageTitle = `People | ${conf.name}`;
  let pageDescription = `People and their sessions at ${conf.name}.`;
  let pageContent: ReactElement;

  if (shouldLoadDetails) {
    const isDetailLoading = personDetailLoading;
    const detailError = personDetailError;

    if (isDetailLoading) return <LoadingScreen />;
    if (detailError || !personDetail) {
      return <ErrorScreen />;
    }

    pageTitle = `${personDetail.person.name} | ${conf.name}`;
    pageDescription = metaDescription;
    pageContent = (
      <PersonDetails
        key={personDetail.person.id}
        person={personDetail.person}
        events={personDetail.events}
        locations={personDetail.locations}
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
        {aiMetadata({
          title: pageTitle,
          description: pageDescription,
          path: conferencePath(
            conf,
            shouldLoadDetails && personId !== null ? `people/?id=${personId}` : "people/",
          ),
          jsonFeeds: conferenceDataFeeds(conf),
        })}
      </Head>
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        {pageContent}
      </ConferenceLayout>
    </>
  );
}
