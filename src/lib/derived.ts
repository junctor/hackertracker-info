import { readFile } from "fs/promises";
import path from "path";

import { ConferenceManifest } from "./conferences";
import { DerivedSiteMenu, DerivedTagIdsByLabel } from "./types/ht-types";

const jsonCache = new Map<string, Promise<unknown | null>>();

async function readJsonFile<T>(fsPath: string): Promise<T | null> {
  let cached = jsonCache.get(fsPath);
  if (!cached) {
    cached = readFile(fsPath, "utf8")
      .then((contents) => JSON.parse(contents) as T)
      .catch(() => null);
    jsonCache.set(fsPath, cached);
  }

  return (await cached) as T | null;
}

function toFsPath(publicPath: string) {
  return path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
}

export async function loadDerivedSiteMenu(
  conf: ConferenceManifest,
): Promise<DerivedSiteMenu | null> {
  const publicPath = `${conf.dataRoot}/derived/siteMenu.json`;
  return readJsonFile<DerivedSiteMenu>(toFsPath(publicPath));
}

export async function loadDerivedTagIdsByLabel(
  conf: ConferenceManifest,
): Promise<DerivedTagIdsByLabel | null> {
  const publicPath = `${conf.dataRoot}/derived/tagIdsByLabel.json`;
  return readJsonFile<DerivedTagIdsByLabel>(toFsPath(publicPath));
}
