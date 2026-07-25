import { getDirectoryInitials } from "@/lib/directoryText";

export function getPersonInitials(name?: string | null): string {
  return getDirectoryInitials(name);
}
