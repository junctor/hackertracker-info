import type { ReactNode } from "react";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useId, useState } from "react";

type SearchProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
};

type Props = {
  title: ReactNode;
  actions?: ReactNode;
  actionsInline?: boolean;
  description?: ReactNode;
  kicker?: ReactNode;
  media?: ReactNode;
  resultLabel?: ReactNode;
  search?: SearchProps;
  children?: ReactNode;
};

export default function PageHeader({
  title,
  actions,
  actionsInline,
  description,
  kicker,
  media,
  resultLabel,
  search,
  children,
}: Props) {
  const searchInputId = useId();
  const [draftSearchValue, setDraftSearchValue] = useState(search?.value ?? "");
  const hasControls = Boolean(search || children);
  const hasHeaderAside = Boolean(resultLabel || actions);
  const isInlineHeader = Boolean(actionsInline && hasHeaderAside);
  const isSubmitSearch = Boolean(search?.onSubmit);
  const searchValue = isSubmitSearch ? draftSearchValue : (search?.value ?? "");
  const titleContent =
    typeof title === "string" ? <h1 className="ui-heading-1">{title}</h1> : title;

  useEffect(() => {
    setDraftSearchValue(search?.value ?? "");
  }, [search?.value]);

  return (
    <header className="ui-page-header">
      <div className={`ui-page-header-row${isInlineHeader ? " ui-page-header-row-inline" : ""}`}>
        <div className="ui-page-header-copy">
          {kicker ? <p className="ui-kicker ui-page-header-kicker">{kicker}</p> : null}
          {titleContent}
          {description ? <p className="ui-page-description">{description}</p> : null}
        </div>

        {hasHeaderAside ? (
          <div className="ui-page-header-aside">
            {resultLabel ? (
              <p role="status" aria-live="polite" className="ui-meta-pill ui-page-header-count">
                {resultLabel}
              </p>
            ) : null}
            {actions ? <div className="ui-page-header-actions">{actions}</div> : null}
          </div>
        ) : null}
      </div>

      {media ? <div className="ui-page-header-media">{media}</div> : null}

      {hasControls ? (
        <form
          role={search ? "search" : undefined}
          onSubmit={(e) => {
            e.preventDefault();
            if (search?.onSubmit) {
              search.onSubmit(draftSearchValue);
            }
          }}
          className="ui-control-panel"
          data-has-extra={children ? "true" : undefined}
          data-has-submit={search?.onSubmit ? "true" : undefined}
        >
          {search ? (
            <label htmlFor={searchInputId} className="ui-page-header-search-label">
              <span className="ui-visually-hidden">{search.label}</span>
              <span className="ui-search-field">
                <MagnifyingGlassIcon className="ui-icon-sm ui-search-icon" aria-hidden="true" />
                <input
                  id={searchInputId}
                  type="search"
                  placeholder={search.placeholder}
                  value={searchValue}
                  onChange={(e) => {
                    const nextValue = e.currentTarget.value;
                    if (isSubmitSearch) {
                      setDraftSearchValue(nextValue);
                    } else {
                      search.onChange?.(nextValue);
                    }
                  }}
                  autoComplete="off"
                  enterKeyHint={search.onSubmit ? "search" : undefined}
                  className="ui-search-input"
                />
              </span>
            </label>
          ) : null}

          {search?.onSubmit ? (
            <button
              type="submit"
              aria-label={search.label}
              title="Search"
              className="ui-btn-base ui-btn-secondary ui-focus-ring ui-page-header-search-submit"
            >
              <MagnifyingGlassIcon className="ui-icon-sm" aria-hidden="true" />
            </button>
          ) : null}

          {children ? <div className="ui-page-header-extra">{children}</div> : null}
        </form>
      ) : null}
    </header>
  );
}
