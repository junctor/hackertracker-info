import { CodeBracketSquareIcon } from "@heroicons/react/16/solid";

function SiteFooter() {
  return (
    <footer className="ui-site-footer">
      <div className="ui-container ui-site-footer-inner">
        <div className="ui-site-footer-row">
          <div className="ui-site-footer-brand">
            <p className="ui-section-label ui-site-footer-label">Hacker Tracker</p>
            <div className="ui-site-footer-title-row">
              <span className="ui-site-footer-title ui-clip-text">info.defcon.org</span>
              <span className="ui-site-footer-subtitle">DEF CON</span>
            </div>
          </div>

          <div className="ui-site-footer-actions">
            <a
              href="https://github.com/junctor/hackertracker-info"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              className="ui-icon-plain ui-site-footer-source"
            >
              <CodeBracketSquareIcon className="ui-icon-xs" aria-hidden="true" />
              <span>View Source</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
