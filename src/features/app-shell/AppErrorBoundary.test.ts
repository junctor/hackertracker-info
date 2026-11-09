import { describe, expect, it } from "vite-plus/test";

import { getAppErrorBoundaryKey } from "./AppErrorBoundary";

describe("app error boundary", () => {
  it("resets when either the route path or query changes", () => {
    expect(getAppErrorBoundaryKey("/defcon35/search/", "?q=one")).not.toBe(
      getAppErrorBoundaryKey("/defcon35/search/", "?q=two"),
    );
    expect(getAppErrorBoundaryKey("/defcon35/search/", "?q=one")).not.toBe(
      getAppErrorBoundaryKey("/defcon35/content/", "?q=one"),
    );
  });
});
