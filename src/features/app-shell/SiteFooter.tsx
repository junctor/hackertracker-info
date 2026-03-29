import { CodeBracketSquareIcon } from "@heroicons/react/16/solid";

function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(2,6,23,0.92),rgba(2,6,23,0.98))] text-slate-300">
      <div className="ui-container py-5 sm:py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 space-y-1.5">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase">
              Hacker Tracker
            </p>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="truncate text-sm font-semibold tracking-tight text-[#6CCDBB] sm:text-base">
                info.defcon.org
              </span>
              <span className="text-xs text-slate-500 sm:text-sm">DEF CON</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <a
              href="https://github.com/junctor/hackertracker-info"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              className="ui-btn-base ui-btn-secondary ui-focus-ring gap-2 rounded-xl px-3.5 text-sm text-slate-200 shadow-[0_10px_24px_rgba(2,6,23,0.18)] focus-visible:outline-none"
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
