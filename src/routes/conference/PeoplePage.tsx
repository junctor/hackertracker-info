import { lazy, useMemo, type ReactElement } from "react";

import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import PeopleList from "@/features/people/PeopleList";
import { aiMetadata, conferenceDataFeeds, conferencePath } from "@/lib/aiMetadata";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { conferenceMenuPath } from "@/lib/routes";
import { PeopleCardsView, PeopleDetailsById } from "@/lib/types/ht-types/views";
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
    data: peopleDetailsById,
    error: personDetailError,
    isLoading: personDetailLoading,
  } = useConferenceJson<PeopleDetailsById>(conf, shouldLoadDetails ? "details/people.json" : null);

  const personDetail = shouldLoadDetails ? peopleDetailsById?.[String(personId)] : undefined;

  const metaDescription = useMemo(() => {
    const fallback = `Learn more about ${personDetail?.person.name ?? "this person"} at ${conf.name}.`;
    const rawDescription = personDetail?.person.description?.trim();
    const base = rawDescription && rawDescription.length > 0 ? rawDescription : fallback;
    const normalized = base.replace(/\s+/g, " ").trim();
    if (normalized.length === 0) return fallback;
    if (normalized.length <= 150) return normalized;
    return `${normalized.slice(0, 147).trimEnd()}...`;
  }, [personDetail, conf.name]);

  const peopleListHref = `/${conf.slug}/people/`;
  const conferenceHomeHref = conferenceMenuPath(conf);

  if (!isReady) return <LoadingScreen />;
  if (isIdInvalid) {
    return (
      <ErrorScreen
        title="Person not found"
        copy="Use a numeric person ID, or browse the people list."
        kicker="Not found"
        primaryActionHref={peopleListHref}
        primaryActionLabel="Browse People"
        secondaryActionHref={conferenceHomeHref}
        secondaryActionLabel="Conference Home"
      />
    );
  }

  let pageTitle = `People | ${conf.name}`;
  let pageDescription = `People and their sessions at ${conf.name}.`;
  let pageContent: ReactElement;

  if (shouldLoadDetails) {
    if (personDetailLoading) return <LoadingScreen />;
    if (personDetailError) {
      return (
        <ErrorScreen
          title="Couldn't load person"
          copy="The person details could not be loaded. Try the people list instead."
          primaryActionHref={peopleListHref}
          primaryActionLabel="Browse People"
          secondaryActionHref={conferenceHomeHref}
          secondaryActionLabel="Conference Home"
        />
      );
    }
    if (!personDetail) {
      return (
        <ErrorScreen
          title="Person not found"
          copy={`No person exists for ID ${personId}.`}
          kicker="Not found"
          primaryActionHref={peopleListHref}
          primaryActionLabel="Browse People"
          secondaryActionHref={conferenceHomeHref}
          secondaryActionLabel="Conference Home"
        />
      );
    }

    pageTitle = `${personDetail.person.name} | ${conf.name}`;
    pageDescription = metaDescription;
    pageContent = (
      <PersonDetails
        key={personDetail.person.id}
        person={personDetail.person}
        sessions={personDetail.sessions}
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
          path: conferencePath(conf, shouldLoadDetails ? `people/?id=${personId}` : "people/"),
          jsonFeeds: conferenceDataFeeds(conf),
        })}
      </Head>
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        {pageContent}
      </ConferenceLayout>
    </>
  );
}
