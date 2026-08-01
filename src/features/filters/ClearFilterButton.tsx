import { XMarkIcon } from "@heroicons/react/24/outline";

type ClearFilterButtonProps = {
  destinationLabel: string;
  onClear: () => void;
};

export default function ClearFilterButton({ destinationLabel, onClear }: ClearFilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="ui-btn-base ui-focus-ring ui-inset-highlight-soft ui-schedule-compact-button ui-schedule-tool-link ui-schedule-clear-filter-button"
      aria-label={`Clear selected ${destinationLabel.toLowerCase()} filters`}
    >
      <XMarkIcon className="ui-icon-menu ui-schedule-tool-icon" aria-hidden="true" />
      <span className="ui-schedule-compact-label ui-schedule-tool-label">Clear filters</span>
    </button>
  );
}
