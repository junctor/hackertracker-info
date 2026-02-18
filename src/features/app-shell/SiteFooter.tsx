import { CodeBracketSquareIcon } from "@heroicons/react/16/solid";

function SiteFooter() {
  return (
    <footer className="border-t border-[#0D294A]/60 bg-gray-950/40">
      <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-gray-400 sm:text-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="truncate font-medium text-[#6CCDBB]">
            info.defcon.org
          </span>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-gray-500">DEF CON - Hacker Tracker</span>
            <a
              href="https://github.com/junctor/hackertracker-info"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
              className="ui-link ui-focus-ring inline-flex items-center gap-1 rounded-md px-2 py-1"
            >
              <CodeBracketSquareIcon className="h-5 w-5" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
