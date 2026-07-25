import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useEffect, useId, useRef, useState } from "react";

import type { ConferenceManifest } from "@/lib/conferences";

import { getScheduleExportDownloadName, getScheduleExportLinks } from "@/lib/scheduleExports";

type ScheduleExportMenuProps = {
  conf: ConferenceManifest;
  defaultOpen?: boolean;
};

export default function ScheduleExportMenu({ conf, defaultOpen = false }: ScheduleExportMenuProps) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const shouldFocusMenuRef = useRef(false);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const exportLinks = getScheduleExportLinks(conf);

  useEffect(() => {
    if (!isOpen) return undefined;

    if (shouldFocusMenuRef.current) {
      firstLinkRef.current?.focus();
      shouldFocusMenuRef.current = false;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || rootRef.current?.contains(target)) return;
      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="ui-schedule-export-control">
      <button
        type="button"
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="ui-btn-base ui-focus-ring ui-inset-highlight-soft ui-schedule-compact-button ui-schedule-tool-link ui-schedule-export-trigger"
        onClick={() =>
          setIsOpen((open) => {
            const nextOpen = !open;
            if (!nextOpen) {
              shouldFocusMenuRef.current = false;
            }
            return nextOpen;
          })
        }
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
            event.preventDefault();
            setIsOpen((open) => {
              const nextOpen = !open;
              shouldFocusMenuRef.current = nextOpen;
              return nextOpen;
            });
            return;
          }

          if (event.key === "ArrowDown") {
            event.preventDefault();
            shouldFocusMenuRef.current = true;
            setIsOpen(true);
          }
        }}
      >
        <ArrowDownTrayIcon className="ui-icon-menu ui-schedule-tool-icon" aria-hidden="true" />
        <span className="ui-schedule-compact-label ui-schedule-tool-label">Export</span>
      </button>

      {isOpen ? (
        <div
          id={menuId}
          className="ui-card ui-schedule-export-menu"
          aria-label="Schedule export options"
        >
          <p className="ui-schedule-export-menu-note">Full conference schedule</p>
          <ul className="ui-schedule-export-menu-list">
            <li>
              <a
                ref={firstLinkRef}
                href={exportLinks.csv}
                download={getScheduleExportDownloadName(conf, "csv")}
                className="ui-focus-ring ui-schedule-export-menu-item"
                onClick={() => setIsOpen(false)}
              >
                Schedule CSV
              </a>
            </li>
            <li>
              <a
                href={exportLinks.json}
                download={getScheduleExportDownloadName(conf, "json")}
                className="ui-focus-ring ui-schedule-export-menu-item"
                onClick={() => setIsOpen(false)}
              >
                Schedule JSON
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
