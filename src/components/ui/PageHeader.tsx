import type { ReactNode } from "react";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useId, useRef, useState } from "react";

type SearchProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange?: (value: string) => void;
  onDebouncedSubmit?: (value: string) => void;
  onSubmit?: (value: string) => void;
  debounceMs?: number;
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
  const debounceTimerRef = useRef<number | null>(null);
  const debounceVersionRef = useRef(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isComposingRef = useRef(false);
  const submittedDraftValueRef = useRef<string | null>(null);
  const onSubmitRef = useRef(search?.onSubmit);
  const onDebouncedSubmitRef = useRef(search?.onDebouncedSubmit);
  const hasControls = Boolean(search || children);
  const hasHeaderAside = Boolean(resultLabel || actions);
  const isInlineHeader = Boolean(actionsInline && hasHeaderAside);
  const isSubmitSearch = Boolean(search?.onSubmit);
  const searchDebounceMs = search?.debounceMs ?? 300;
  const hasDebouncedSubmit = Boolean(search?.onDebouncedSubmit);
  const showSearchSubmitButton = Boolean(search?.onSubmit && !search?.onDebouncedSubmit);
  const showHiddenSearchSubmitButton = Boolean(search?.onSubmit && search?.onDebouncedSubmit);
  const searchValue = isSubmitSearch ? draftSearchValue : (search?.value ?? "");
  const titleContent =
    typeof title === "string" ? <h1 className="ui-heading-1">{title}</h1> : title;

  const clearDebounceTimer = () => {
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  };

  const submitCurrentSearch = (value: string) => {
    clearDebounceTimer();
    debounceVersionRef.current += 1;
    submittedDraftValueRef.current = value;
    onSubmitRef.current?.(value);
  };

  const clearCurrentSearch = () => {
    if (isSubmitSearch) {
      setDraftSearchValue("");
      submitCurrentSearch("");
    } else {
      search?.onChange?.("");
    }

    inputRef.current?.focus();
  };

  useEffect(() => {
    onSubmitRef.current = search?.onSubmit;
    onDebouncedSubmitRef.current = search?.onDebouncedSubmit;
  }, [search?.onDebouncedSubmit, search?.onSubmit]);

  useEffect(() => {
    const nextValue = search?.value ?? "";
    const submittedValue = submittedDraftValueRef.current;

    if (submittedValue !== null && submittedValue.trim() === nextValue) {
      submittedDraftValueRef.current = null;
      return;
    }

    submittedDraftValueRef.current = null;
    setDraftSearchValue(nextValue);
  }, [search?.value]);

  useEffect(() => {
    if (!hasDebouncedSubmit || !isSubmitSearch || isComposingRef.current) return;

    const currentVersion = debounceVersionRef.current + 1;
    debounceVersionRef.current = currentVersion;
    clearDebounceTimer();

    debounceTimerRef.current = window.setTimeout(() => {
      if (debounceVersionRef.current !== currentVersion || isComposingRef.current) return;

      submittedDraftValueRef.current = draftSearchValue;
      onDebouncedSubmitRef.current?.(draftSearchValue);
      debounceTimerRef.current = null;
    }, searchDebounceMs);

    return clearDebounceTimer;
  }, [draftSearchValue, hasDebouncedSubmit, isSubmitSearch, searchDebounceMs]);

  useEffect(() => clearDebounceTimer, []);

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
            if (search?.onSubmit && !isComposingRef.current) {
              submitCurrentSearch(draftSearchValue);
            }
          }}
          className="ui-control-panel"
          data-has-extra={children ? "true" : undefined}
          data-has-submit={showSearchSubmitButton ? "true" : undefined}
        >
          {search ? (
            <div className="ui-page-header-search-label">
              <label htmlFor={searchInputId} className="ui-visually-hidden">
                {search.label}
              </label>
              <span className="ui-search-field">
                <MagnifyingGlassIcon className="ui-icon-sm ui-search-icon" aria-hidden="true" />
                <input
                  ref={inputRef}
                  id={searchInputId}
                  type="search"
                  placeholder={search.placeholder}
                  value={searchValue}
                  onChange={(e) => {
                    const nextValue = e.currentTarget.value;
                    if (isSubmitSearch) {
                      setDraftSearchValue(nextValue);
                      if (!nextValue && !isComposingRef.current) {
                        submitCurrentSearch("");
                      }
                    } else {
                      search.onChange?.(nextValue);
                    }
                  }}
                  onCompositionStart={() => {
                    isComposingRef.current = true;
                    clearDebounceTimer();
                  }}
                  onCompositionEnd={(e) => {
                    isComposingRef.current = false;
                    setDraftSearchValue(e.currentTarget.value);
                  }}
                  autoComplete="off"
                  enterKeyHint={search.onSubmit ? "search" : undefined}
                  className="ui-search-input"
                />
                {searchValue ? (
                  <button
                    type="button"
                    onClick={clearCurrentSearch}
                    aria-label="Clear search"
                    title="Clear search"
                    className="ui-search-clear-button ui-focus-ring"
                  >
                    <XMarkIcon className="ui-icon-sm" aria-hidden="true" />
                  </button>
                ) : null}
              </span>
            </div>
          ) : null}

          {showSearchSubmitButton ? (
            <button
              type="submit"
              aria-label={search?.label}
              title="Search"
              className="ui-btn-base ui-btn-secondary ui-focus-ring ui-page-header-search-submit"
            >
              <MagnifyingGlassIcon className="ui-icon-sm" aria-hidden="true" />
            </button>
          ) : null}

          {showHiddenSearchSubmitButton ? (
            <button type="submit" tabIndex={-1} className="ui-visually-hidden">
              Search
            </button>
          ) : null}

          {children ? <div className="ui-page-header-extra">{children}</div> : null}
        </form>
      ) : null}
    </header>
  );
}
