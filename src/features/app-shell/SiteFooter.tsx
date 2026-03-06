import { CodeBracketSquareIcon } from "@heroicons/react/16/solid";

function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-400 sm:text-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="truncate font-medium text-[#6CCDBB]">info.defcon.org</span>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-slate-500">DEF CON · Hacker Tracker</span>

            <a
              href="https://github.com/junctor/hackertracker-info"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
              className="ui-focus-ring inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/3 px-2 py-1 text-slate-300 transition hover:bg-white/6 hover:text-[#6CCDBB] focus-visible:outline-none"
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
