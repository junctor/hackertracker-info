import { useEffect, useState } from "react";

export const LONG_LOADING_DELAY_MS = 2500;
export const STILL_LOADING_MESSAGE = "Still loading. This may take a moment on slower connections.";

export function getInitialLoadingMessage(label: string) {
  const trimmedLabel = label.trim();

  return `Loading ${trimmedLabel.length > 0 ? trimmedLabel : "content"}...`;
}

export function startDelayedLoadingMessage(onElapsed: () => void, delayMs = LONG_LOADING_DELAY_MS) {
  const timeoutId = globalThis.setTimeout(onElapsed, delayMs);

  return () => globalThis.clearTimeout(timeoutId);
}

type Props = {
  label: string;
};

export default function LoadingStatus({ label }: Props) {
  const [isStillLoading, setIsStillLoading] = useState(false);
  const initialMessage = getInitialLoadingMessage(label);

  useEffect(() => {
    setIsStillLoading(false);

    return startDelayedLoadingMessage(() => setIsStillLoading(true));
  }, [label]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-busy="true"
      className="ui-loading-status"
    >
      <span aria-hidden="true" className="ui-loading-status-spinner" />

      <span className="ui-loading-status-copy">
        <span className="ui-loading-status-title">{initialMessage}</span>
        {isStillLoading ? (
          <span className="ui-loading-status-detail">{STILL_LOADING_MESSAGE}</span>
        ) : null}
      </span>

      <span aria-hidden="true" className="ui-loading-status-bar">
        <span className="ui-loading-status-bar-fill" />
      </span>
    </div>
  );
}
