function SiteFooter() {
  return (
    <footer className="border-t border-gray-800/80 bg-gray-950/40">
      <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-gray-400 sm:text-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="truncate font-medium text-gray-300">
            info.defcon.org
          </span>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <a
              href="https://github.com/junctor/hackertracker-info"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded px-1 py-0.5 text-gray-400 transition hover:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
            >
              GitHub
            </a>
            <span className="text-gray-600" aria-hidden="true">
              •
            </span>
            <span className="text-gray-500">DEF CON - Hacker Tracker</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
