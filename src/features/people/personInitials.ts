const QUOTED_NAME_SEGMENT_PATTERN =
  /(^|[\s([{<])["'`“‘«‹„‚][^"'`“”‘’«»‹›„‚]*["'`”’»›“‘](?=$|[\s)\]}>.,;:!?])/gu;
const WRAPPED_NAME_SEGMENT_PATTERNS = [/\([^)]*\)/gu, /\[[^\]]*\]/gu, /\{[^}]*\}/gu, /<[^>]*>/gu];
const LETTER_PATTERN = /\p{L}/u;

function removeWrappedNameSegments(name: string): string {
  let cleanedName = name.replace(QUOTED_NAME_SEGMENT_PATTERN, "$1 ");

  for (const pattern of WRAPPED_NAME_SEGMENT_PATTERNS) {
    cleanedName = cleanedName.replace(pattern, " ");
  }

  return cleanedName;
}

export function getPersonInitials(name?: string | null): string {
  if (typeof name !== "string") return "";

  const initials = removeWrappedNameSegments(name)
    .split(/\s+/)
    .map((part) => LETTER_PATTERN.exec(part)?.[0])
    .filter((letter): letter is string => Boolean(letter))
    .slice(0, 2)
    .join("");

  return initials.toLocaleUpperCase();
}
