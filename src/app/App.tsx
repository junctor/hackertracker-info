import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router";

import AppErrorBoundary from "@/features/app-shell/AppErrorBoundary";
import ConferenceLoadingScreen from "@/features/app-shell/ConferenceLoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import { ConferenceManifest, getConference } from "@/lib/conferences";
import { useConferenceRouteParam } from "@/lib/hooks/useConferenceRouteParam";
import {
  CONFERENCE_ROUTE_DEFINITIONS,
  conferenceRouteMatchesSegment,
  conferenceRoutePaths,
  conferenceMenuPath,
  type ConferenceRouteKey,
} from "@/lib/routes";
import { PageId } from "@/lib/types/page-meta";

import AppScrollRestoration from "./AppScrollRestoration";

const HomePage = lazy(() => import("@/routes/HomePage"));
const ConferencesPage = lazy(() => import("@/routes/ConferencesPage"));
const TVPage = lazy(() => import("@/routes/TVPage"));
const AnnouncementsPage = lazy(() => import("@/routes/conference/AnnouncementsPage"));
const BookmarksPage = lazy(() => import("@/routes/conference/BookmarksPage"));
const CommunitiesPage = lazy(() => import("@/routes/conference/CommunitiesPage"));
const ContestsPage = lazy(() => import("@/routes/conference/ContestsPage"));
const ContentPage = lazy(() => import("@/routes/conference/ContentPage"));
const DepartmentsPage = lazy(() => import("@/routes/conference/DepartmentsPage"));
const DocumentPage = lazy(() => import("@/routes/conference/DocumentPage"));
const ExhibitorsPage = lazy(() => import("@/routes/conference/ExhibitorsPage"));
const LocationsPage = lazy(() => import("@/routes/conference/LocationsPage"));
const MapsPage = lazy(() => import("@/routes/conference/MapsPage"));
const MenuPage = lazy(() => import("@/routes/conference/MenuPage"));
const MerchPage = lazy(() => import("@/routes/conference/MerchPage"));
const OrganizationPage = lazy(() => import("@/routes/conference/OrganizationPage"));
const OrganizationsPage = lazy(() => import("@/routes/conference/OrganizationsPage"));
const PeoplePage = lazy(() => import("@/routes/conference/PeoplePage"));
const ReadmePage = lazy(() => import("@/routes/conference/ReadmePage"));
const SchedulePage = lazy(() => import("@/routes/conference/SchedulePage"));
const SearchPage = lazy(() => import("@/routes/conference/SearchPage"));
const TagPage = lazy(() => import("@/routes/conference/TagPage"));
const TagsPage = lazy(() => import("@/routes/conference/TagsPage"));
const TagsRedirectPage = lazy(() => import("@/routes/conference/TagsRedirectPage"));
const VendorsPage = lazy(() => import("@/routes/conference/VendorsPage"));
const VillagesPage = lazy(() => import("@/routes/conference/VillagesPage"));

const CONFERENCE_ROUTE_COMPONENTS = {
  announcements: AnnouncementsPage,
  bookmarks: BookmarksPage,
  communities: CommunitiesPage,
  contests: ContestsPage,
  content: ContentPage,
  departments: DepartmentsPage,
  document: DocumentPage,
  exhibitors: ExhibitorsPage,
  filters: TagsPage,
  locations: LocationsPage,
  maps: MapsPage,
  menu: MenuPage,
  merch: MerchPage,
  organization: OrganizationPage,
  organizations: OrganizationsPage,
  people: PeoplePage,
  readme: ReadmePage,
  schedule: SchedulePage,
  search: SearchPage,
  speakers: PeoplePage,
  tag: TagPage,
  tags: TagsRedirectPage,
  vendors: VendorsPage,
  villages: VillagesPage,
} satisfies Record<ConferenceRouteKey, ConferenceRouteComponent>;

type ConferenceRouteProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

type ConferenceRouteComponent =
  | ComponentType<ConferenceRouteProps>
  | LazyExoticComponent<ComponentType<ConferenceRouteProps>>;

function NotFound() {
  return (
    <ErrorScreen
      title="Page not found"
      copy="Check the address, or head back to the site home page."
      kicker="Not found"
    />
  );
}

function UnsupportedConference() {
  return (
    <ErrorScreen
      title="Conference not found"
      copy="This conference is not available on info.defcon.org."
      kicker="Not found"
      primaryActionHref="/conferences"
      primaryActionLabel="Browse Conferences"
      secondaryActionHref="/"
      secondaryActionLabel="Site Home"
    />
  );
}

function ConferenceRouteNotFound() {
  const conf = useConferenceRouteParam();

  if (!conf) return <UnsupportedConference />;

  const scheduleHref =
    conf.schedulePath ?? (conf.siteMenu.includes("schedule") ? `/${conf.slug}/schedule/` : null);

  return (
    <ErrorScreen
      title="Conference page not found"
      copy={`That page is not available for ${conf.name}.`}
      kicker="Not found"
      primaryActionHref={conferenceMenuPath(conf)}
      primaryActionLabel="Conference Home"
      secondaryActionHref={scheduleHref ?? undefined}
      secondaryActionLabel={scheduleHref ? "Schedule" : undefined}
    />
  );
}

function ConferenceRootRedirect() {
  const conf = useConferenceRouteParam();

  if (!conf) return <UnsupportedConference />;

  return <Navigate to={conferenceMenuPath(conf)} replace />;
}

function ConferenceRoute({
  component: Component,
  activePageId,
}: {
  component: ConferenceRouteComponent;
  activePageId: PageId;
}) {
  const conf = useConferenceRouteParam();

  if (!conf) return <UnsupportedConference />;

  return <Component conf={conf} activePageId={activePageId} />;
}

function conferenceRoute(path: string, component: ConferenceRouteComponent, activePageId: PageId) {
  return (
    <Route
      key={path}
      path={path}
      element={<ConferenceRoute component={component} activePageId={activePageId} />}
    />
  );
}

function RouteLoadingFallback() {
  const location = useLocation();
  const [conferenceSegment = "", routeSegment = ""] = location.pathname.split("/").filter(Boolean);
  const conference = getConference(conferenceSegment);

  if (!conference) return <LoadingScreen />;

  const route = CONFERENCE_ROUTE_DEFINITIONS.find((definition) =>
    conferenceRouteMatchesSegment(definition, routeSegment),
  );

  if (!route) return <LoadingScreen />;

  return (
    <ConferenceLoadingScreen
      conference={conference}
      activePageId={route.activePageId}
      variant={route.activePageId === "schedule" ? "schedule" : "default"}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppScrollRestoration />
      <AppErrorBoundary>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="conferences" element={<ConferencesPage />} />
            <Route path="conferences/*" element={<NotFound />} />
            <Route path="tv" element={<TVPage />} />
            <Route path="tv/*" element={<NotFound />} />

            <Route path=":conf">
              <Route index element={<ConferenceRootRedirect />} />
              {CONFERENCE_ROUTE_DEFINITIONS.flatMap((definition) =>
                conferenceRoutePaths(definition).map((path) =>
                  conferenceRoute(
                    path,
                    CONFERENCE_ROUTE_COMPONENTS[definition.key],
                    definition.activePageId,
                  ),
                ),
              )}
              <Route path="*" element={<ConferenceRouteNotFound />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AppErrorBoundary>
    </BrowserRouter>
  );
}
