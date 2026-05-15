export default function LoadingScreen() {
  return (
    <main id="main-content" className="ui-page-shell ui-detail-card">
      <div aria-hidden="true" className="ui-screen-glow-loading" />

      <section className="ui-page-main ui-screen-main">
        <div role="status" aria-live="polite" aria-busy="true" className="ui-card ui-loading-card">
          <div aria-hidden="true" className="ui-screen-card-rule" />

          <div aria-hidden="true" className="ui-loading-mark">
            <span className="ui-loading-ring" />
            <span className="ui-loading-spinner" />
            <span className="ui-loading-pulse-dot" />
          </div>

          <p className="ui-kicker ui-screen-kicker">Loading</p>
          <h1 className="ui-loading-title">Loading conference data</h1>
          <p className="ui-loading-copy">Pulling together sessions, content, and navigation.</p>

          <div aria-hidden="true" className="ui-loading-skeleton">
            <div className="ui-loading-skeleton-line" />
            <div className="ui-loading-skeleton-line" />
            <div className="ui-loading-skeleton-line" />
          </div>

          <span className="ui-visually-hidden">Loading conference data.</span>
        </div>
      </section>
    </main>
  );
}
