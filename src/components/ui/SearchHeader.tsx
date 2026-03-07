import type { ReactNode, Dispatch, SetStateAction } from "react";

type Props = {
  title: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: Dispatch<SetStateAction<string>>;
  children?: ReactNode;
};

export default function SearchHeader({
  title,
  searchLabel,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  children,
}: Props) {
  return (
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h1 className="ui-heading-1">{title}</h1>
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:w-auto">
        <label className="w-full max-w-sm">
          <span className="sr-only">{searchLabel}</span>
          <input
            type="search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.currentTarget.value)}
            aria-label={searchLabel}
            className="ui-input-base ui-input-focus focus-visible:outline-none"
          />
        </label>
        {children}
      </div>
    </header>
  );
}
