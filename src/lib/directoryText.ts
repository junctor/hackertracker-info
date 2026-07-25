const QUOTED_NAME_SEGMENT_PATTERN =
  /(^|[\s([{<])["'`“‘«‹„‚][^"'`“”‘’«»‹›„‚]*["'`”’»›“‘](?=$|[\s)\]}>.,;:!?])/gu;
const WRAPPED_NAME_SEGMENT_PATTERNS = [/\([^)]*\)/gu, /\[[^\]]*\]/gu, /\{[^}]*\}/gu, /<[^>]*>/gu];
const LETTER_OR_NUMBER_PATTERN = /[\p{L}\p{N}]/u;

function normalizeDirectoryName(name?: string | null): string {
  return typeof name === "string" ? name.trim().replace(/\s+/g, " ") : "";
}

function removeWrappedNameSegments(name: string): string {
  let cleanedName = name.replace(QUOTED_NAME_SEGMENT_PATTERN, "$1 ");

  for (const pattern of WRAPPED_NAME_SEGMENT_PATTERNS) {
    cleanedName = cleanedName.replace(pattern, " ");
  }

  return cleanedName;
}

function firstVisibleCharacter(value: string): string {
  return Array.from(value.trim())[0] ?? "";
}

function getLetterOrNumberInitials(name: string, maxLength: number): string {
  return name
    .split(/\s+/)
    .map((part) => LETTER_OR_NUMBER_PATTERN.exec(part)?.[0])
    .filter((letter): letter is string => Boolean(letter))
    .slice(0, maxLength)
    .join("");
}

export function getDirectoryInitials(name?: string | null, maxLength = 2): string {
  const displayName = normalizeDirectoryName(name);
  if (!displayName) return "";

  const cleanedName = removeWrappedNameSegments(displayName);
  const initials =
    getLetterOrNumberInitials(cleanedName, maxLength) ||
    getLetterOrNumberInitials(displayName, maxLength) ||
    firstVisibleCharacter(displayName);

  return initials.toLocaleUpperCase();
}

export function getDirectorySectionInitial(name?: string | null): string {
  const displayName = normalizeDirectoryName(name);
  if (!displayName) return "#";

  const visibleInitial =
    LETTER_OR_NUMBER_PATTERN.exec(displayName)?.[0] || firstVisibleCharacter(displayName);

  return visibleInitial.toLocaleUpperCase();
}
