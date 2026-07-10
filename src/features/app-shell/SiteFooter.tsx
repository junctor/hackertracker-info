function SiteFooter() {
  return (
    <footer className="ui-site-footer">
      <div className="ui-chrome-container ui-site-footer-inner">
        <div className="ui-site-footer-row">
          <div className="ui-site-footer-brand">
            <a href="/apps/" className="ui-focus-ring ui-site-footer-link">
              <p className="ui-section-label ui-site-footer-label hacker-tracker-text">
                Hacker Tracker
              </p>
            </a>
          </div>

          <div className="ui-site-footer-actions">
            <a
              href="https://github.com/junctor/hackertracker-info"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              className="ui-icon-plain ui-site-footer-source"
            >
              <img
                src="/images/icons/github-invertocat-white.svg"
                alt=""
                className="ui-icon-xs"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
