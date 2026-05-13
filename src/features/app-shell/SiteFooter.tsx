import { CodeBracketSquareIcon } from "@heroicons/react/16/solid";

function SiteFooter() {
  return (
    <footer className="ui-site-footer border-t border-(--border) text-(--text-muted)">
      <div className="ui-container py-5 sm:py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 space-y-1.5">
            <p className="ui-section-label text-xs">Hacker Tracker</p>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="truncate text-sm font-semibold text-(--accent-success) sm:text-base">
                info.defcon.org
              </span>
              <span className="text-xs text-(--text-subtle) sm:text-sm">DEF CON</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <a
              href="https://github.com/junctor/hackertracker-info"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              className="ui-icon-plain gap-2 rounded-xl px-3.5 text-sm font-medium"
            >
              <CodeBracketSquareIcon className="h-4 w-4" aria-hidden="true" />
              <span>View Source</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
