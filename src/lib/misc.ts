function cleanForSort(str: string): string {
  return str.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

export function alphaSort(a: string, b: string): number {
  const cleanA = cleanForSort(a);
  const cleanB = cleanForSort(b);
  return cleanA.localeCompare(cleanB);
}
