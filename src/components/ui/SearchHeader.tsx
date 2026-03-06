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
    <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h1 className="text-3xl font-extrabold text-gray-100 md:text-4xl">{title}</h1>
      <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
        <label className="w-full max-w-sm">
          <span className="sr-only">{searchLabel}</span>
          <input
            type="search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.currentTarget.value)}
            aria-label={searchLabel}
            className="ui-input-focus w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder:text-gray-500 focus-visible:outline-none"
          />
        </label>
        {children}
      </div>
    </header>
  );
}
