import { useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router";

type RouteSnapshot = {
  key: string;
  pathname: string;
  search: string;
  hash: string;
};

type ScrollPosition = {
  x: number;
  y: number;
};

function getQueryId(search: string) {
  return new URLSearchParams(search).get("id");
}

function hasQueryId(search: string) {
  return new URLSearchParams(search).has("id");
}

function shouldResetScroll(previous: RouteSnapshot | null, current: RouteSnapshot) {
  if (!previous) return true;
  if (current.hash && current.hash !== previous.hash) return true;
  if (current.pathname !== previous.pathname) return true;

  return getQueryId(current.search) !== getQueryId(previous.search);
}

function scrollToHash(hash: string) {
  let frameId = 0;
  const expiresAt = performance.now() + 2_000;
  const id = decodeURIComponent(hash.slice(1));

  const scrollIfReady = () => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView();
      return;
    }

    if (performance.now() < expiresAt) {
      frameId = window.requestAnimationFrame(scrollIfReady);
    }
  };

  scrollIfReady();

  return () => {
    if (frameId) {
      window.cancelAnimationFrame(frameId);
    }
  };
}

function scrollToLocationTarget(location: RouteSnapshot) {
  if (!location.hash) {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return undefined;
  }

  try {
    const cancelHashScroll = scrollToHash(location.hash);
    return cancelHashScroll;
  } catch {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return undefined;
  }
}

function toSnapshot(location: RouteSnapshot): RouteSnapshot {
  return {
    key: location.key,
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
  };
}

export default function AppScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousLocationRef = useRef<RouteSnapshot | null>(null);
  const scrollPositionsRef = useRef(new Map<string, ScrollPosition>());

  useLayoutEffect(() => {
    if (!("scrollRestoration" in window.history)) return undefined;

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    const currentLocation = toSnapshot(location);
    const previousLocation = previousLocationRef.current;
    const scrollPositions = scrollPositionsRef.current;
    const isDetailRoute = hasQueryId(currentLocation.search);
    let cancelPendingScroll: (() => void) | undefined;

    if (navigationType === "POP" && !isDetailRoute) {
      const savedPosition = scrollPositions.get(currentLocation.key);

      if (savedPosition) {
        window.scrollTo({
          top: savedPosition.y,
          left: savedPosition.x,
          behavior: "auto",
        });
      } else if (shouldResetScroll(previousLocation, currentLocation)) {
        cancelPendingScroll = scrollToLocationTarget(currentLocation);
      }
    } else if (shouldResetScroll(previousLocation, currentLocation)) {
      cancelPendingScroll = scrollToLocationTarget(currentLocation);
    }

    previousLocationRef.current = currentLocation;

    return () => {
      scrollPositions.set(currentLocation.key, {
        x: window.scrollX,
        y: window.scrollY,
      });
      cancelPendingScroll?.();
    };
  }, [location, navigationType]);

  return null;
}
