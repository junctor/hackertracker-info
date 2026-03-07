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
  const hasAuxControl = Boolean(children);

  return (
    <header className="mb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <h1 className="ui-heading-1">{title}</h1>
        <div
          className={`grid w-full gap-3 ${hasAuxControl ? "sm:grid-cols-2" : ""} lg:w-auto lg:min-w-[24rem]`}
        >
          <label className="w-full">
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
          {hasAuxControl ? <div className="w-full">{children}</div> : null}
        </div>
      </div>
    </header>
  );
}
