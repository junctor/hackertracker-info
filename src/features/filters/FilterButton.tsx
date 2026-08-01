import { FunnelIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

type FilterButtonProps = {
  destinationLabel: string;
  href: string;
  isActive?: boolean;
  selectedCount: number;
};

export default function FilterButton({
  destinationLabel,
  href,
  selectedCount,
  isActive = selectedCount > 0,
}: FilterButtonProps) {
  const destinationName = destinationLabel.toLowerCase();

  return (
    <Link
      to={href}
      className={[
        "ui-btn-base ui-focus-ring ui-inset-highlight-soft ui-schedule-compact-button ui-schedule-tool-link",
        isActive ? "ui-schedule-filter-active-button" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={
        selectedCount > 0
          ? `Edit ${selectedCount} selected ${destinationName} filters`
          : `Browse ${destinationName} filters`
      }
      aria-current={isActive ? "page" : undefined}
    >
      <FunnelIcon className="ui-icon-menu ui-schedule-tool-icon" aria-hidden="true" />
      <span className="ui-schedule-compact-label ui-schedule-tool-label">
        {selectedCount > 0 ? `Filters (${selectedCount})` : "Filters"}
      </span>
    </Link>
  );
}
