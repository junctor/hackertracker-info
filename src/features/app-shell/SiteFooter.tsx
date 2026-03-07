import { CodeBracketSquareIcon } from "@heroicons/react/16/solid";

function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="ui-container py-4 text-xs text-slate-400 sm:text-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="truncate font-medium text-[#6CCDBB]">info.defcon.org</span>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-slate-500">DEF CON · Hacker Tracker</span>

            <a
              href="https://github.com/junctor/hackertracker-info"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
              className="ui-focus-ring ui-icon-btn focus-visible:outline-none"
            >
              <CodeBracketSquareIcon className="h-4 w-4" aria-hidden />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
