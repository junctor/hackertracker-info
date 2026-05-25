import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceRouteParam } from "@/lib/hooks/useConferenceRouteParam";
import { CONFERENCE_ROUTE_DEFINITIONS, type ConferenceRouteKey } from "@/lib/routes";
import { PageId } from "@/lib/types/page-meta";

const HomePage = lazy(() => import("@/routes/HomePage"));
const TVPage = lazy(() => import("@/routes/TVPage"));
const AnnouncementsPage = lazy(() => import("@/routes/conference/AnnouncementsPage"));
const BookmarksPage = lazy(() => import("@/routes/conference/BookmarksPage"));
const CommunitiesPage = lazy(() => import("@/routes/conference/CommunitiesPage"));
const ConferenceHomePage = lazy(() => import("@/routes/conference/ConferenceHomePage"));
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
const PeoplePage = lazy(() => import("@/routes/conference/PeoplePage"));
const ReadmePage = lazy(() => import("@/routes/conference/ReadmePage"));
const SchedulePage = lazy(() => import("@/routes/conference/SchedulePage"));
const SearchPage = lazy(() => import("@/routes/conference/SearchPage"));
const TagPage = lazy(() => import("@/routes/conference/TagPage"));
const TagsPage = lazy(() => import("@/routes/conference/TagsPage"));
const VendorsPage = lazy(() => import("@/routes/conference/VendorsPage"));
const VillagesPage = lazy(() => import("@/routes/conference/VillagesPage"));

const CONFERENCE_ROUTE_COMPONENTS = {
  announcements: AnnouncementsPage,
  bookmarks: BookmarksPage,
  communities: CommunitiesPage,
  conferenceHome: ConferenceHomePage,
  contests: ContestsPage,
  content: ContentPage,
  departments: DepartmentsPage,
  document: DocumentPage,
  exhibitors: ExhibitorsPage,
  locations: LocationsPage,
  maps: MapsPage,
  menu: MenuPage,
  merch: MerchPage,
  organization: OrganizationPage,
  people: PeoplePage,
  readme: ReadmePage,
  schedule: SchedulePage,
  search: SearchPage,
  speakers: PeoplePage,
  tag: TagPage,
  tags: TagsPage,
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
      copy="Check the address, or head back to the conference home page."
      msg="No route matched this URL."
    />
  );
}

function ConferenceRoute({
  component: Component,
  activePageId,
}: {
  component: ConferenceRouteComponent;
  activePageId: PageId;
}) {
  const conf = useConferenceRouteParam();

  if (!conf) return <NotFound />;

  return <Component conf={conf} activePageId={activePageId} />;
}

function conferenceRoute(
  path: string | undefined,
  component: ConferenceRouteComponent,
  activePageId: PageId,
) {
  return (
    <Route
      key={path ?? "index"}
      index={path == null}
      path={path}
      element={<ConferenceRoute component={component} activePageId={activePageId} />}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="tv" element={<TVPage />} />

          <Route path=":conf">
            {CONFERENCE_ROUTE_DEFINITIONS.map(({ key, path, activePageId }) =>
              conferenceRoute(path, CONFERENCE_ROUTE_COMPONENTS[key], activePageId),
            )}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
