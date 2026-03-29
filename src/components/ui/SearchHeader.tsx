import type { Dispatch, ReactNode, SetStateAction } from "react";

import { useId } from "react";

type Props = {
  title: ReactNode;
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
  const searchInputId = useId();
  const titleContent =
    typeof title === "string" ? <h1 className="ui-heading-1">{title}</h1> : title;

  return (
    <header className="mb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        {titleContent}
        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          className={`grid w-full gap-3 ${hasAuxControl ? "sm:grid-cols-2" : ""} lg:w-auto lg:min-w-[24rem]`}
        >
          <label htmlFor={searchInputId} className="w-full">
            <span className="sr-only">{searchLabel}</span>
            <input
              id={searchInputId}
              type="search"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.currentTarget.value)}
              className="ui-input-base ui-input-focus focus-visible:outline-none"
            />
          </label>
          {hasAuxControl ? <div className="w-full">{children}</div> : null}
        </form>
      </div>
    </header>
  );
}
