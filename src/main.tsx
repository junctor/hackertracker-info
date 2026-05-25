import "@/styles/globals.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { SWRConfig } from "swr";

import App from "./app/App";

function applyStandaloneModeClasses() {
  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };

  if (navigatorWithStandalone.standalone === true) {
    document.documentElement.classList.add("is-ios-standalone");
  }

  if (window.matchMedia("(display-mode: standalone)").matches) {
    document.documentElement.classList.add("is-standalone");
  }
}

applyStandaloneModeClasses();

createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <SWRConfig
      value={{
        dedupingInterval: 60_000,
        keepPreviousData: true,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
      }}
    >
      <App />
    </SWRConfig>
  </React.StrictMode>,
);
