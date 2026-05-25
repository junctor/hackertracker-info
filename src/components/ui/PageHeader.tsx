import type { Dispatch, ReactNode, SetStateAction } from "react";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useId } from "react";

type SearchProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
};

type Props = {
  title: ReactNode;
  description?: ReactNode;
  kicker?: ReactNode;
  resultLabel?: ReactNode;
  search?: SearchProps;
  children?: ReactNode;
};

export default function PageHeader({
  title,
  description,
  kicker,
  resultLabel,
  search,
  children,
}: Props) {
  const searchInputId = useId();
  const hasControls = Boolean(search || children);
  const titleContent =
    typeof title === "string" ? <h1 className="ui-heading-1">{title}</h1> : title;

  return (
    <header className="ui-page-header">
      <div className="ui-page-header-row">
        <div className="ui-page-header-copy">
          {kicker ? <p className="ui-kicker ui-page-header-kicker">{kicker}</p> : null}
          {titleContent}
          {description ? <p className="ui-page-description">{description}</p> : null}
        </div>

        {resultLabel ? (
          <p role="status" aria-live="polite" className="ui-meta-pill ui-page-header-count">
            {resultLabel}
          </p>
        ) : null}
      </div>

      {hasControls ? (
        <form
          role={search ? "search" : undefined}
          onSubmit={(e) => e.preventDefault()}
          className="ui-control-panel"
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
                  value={search.value}
                  onChange={(e) => search.onChange(e.currentTarget.value)}
                  autoComplete="off"
                  className="ui-search-input"
                />
              </span>
            </label>
          ) : null}

          {children ? <div className="ui-page-header-extra">{children}</div> : null}
        </form>
      ) : null}
    </header>
  );
}
