import type { CSSProperties } from "react";

type AccentStyle = CSSProperties & {
  "--accent-color"?: string;
};

export function getSafeAccentColor(color: string | null | undefined): string | undefined {
  if (!color) return undefined;

  const value = color.trim();

  if (/^#[0-9a-fA-F]{3,8}$/.test(value)) return value;

  return undefined;
}

export function getAccentStyle(color: string | null | undefined): AccentStyle | undefined {
  const safeColor = getSafeAccentColor(color);
  return safeColor ? { "--accent-color": safeColor } : undefined;
}
