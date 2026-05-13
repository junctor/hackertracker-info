import "@/styles/globals.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { SWRConfig } from "swr";

import App from "./app/App";

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
