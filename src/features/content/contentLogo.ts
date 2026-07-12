import { getSafeImageHref } from "@/lib/url";

export function getVisibleContentLogoUrl(
  logoUrl: string | undefined,
  failedLogoUrl: string | null,
): string | null {
  const safeLogoUrl = getSafeImageHref(logoUrl);
  return safeLogoUrl && safeLogoUrl !== failedLogoUrl ? safeLogoUrl : null;
}
