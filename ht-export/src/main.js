import fs from "fs";
import { Buffer } from "buffer";
import {
  firebaseInit,
  getConference,
  getEvents,
  getSpeakers,
  getFbStorage,
  getLocations,
  getTags,
  getNews,
  getOrganizations,
  getDocuments,
  getMenus,
} from "./fb.js";

(async () => {
  const fbDb = await firebaseInit();

  const [
    htConf,
    htEvents,
    htSpeakers,
    htLocations,
    htTags,
    htNews,
    htOrgs,
    htDocuments,
    htMenus,
  ] = await Promise.all([
    getConference(fbDb),
    getEvents(fbDb),
    getSpeakers(fbDb),
    getLocations(fbDb),
    getTags(fbDb),
    getNews(fbDb),
    getOrganizations(fbDb),
    getDocuments(fbDb),
    getMenus(fbDb),
  ]);

  const outputDir = "./out";
  const mapsDir = "./out/ht/maps";
  const imgDir = "./out/ht/img";

  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true });
  }

  fs.mkdirSync(mapsDir, { recursive: true });
  fs.mkdirSync(imgDir, { recursive: true });

  await Promise.all([
    fs.promises.writeFile("./out/ht/conference.json", JSON.stringify(htConf)),
    fs.promises.writeFile("./out/ht/events.json", JSON.stringify(htEvents)),
    fs.promises.writeFile("./out/ht/speakers.json", JSON.stringify(htSpeakers)),
    fs.promises.writeFile("./out/ht/tags.json", JSON.stringify(htTags)),
    fs.promises.writeFile("./out/ht/news.json", JSON.stringify(htNews)),
    fs.promises.writeFile("./out/ht/menus.json", JSON.stringify(htMenus)),
    fs.promises.writeFile(
      "./out/ht/documents.json",
      JSON.stringify(htDocuments)
    ),
    fs.promises.writeFile(
      "./out/ht/organizations.json",
      JSON.stringify(htOrgs)
    ),

    fs.promises.writeFile(
      "./out/ht/locations.json",
      JSON.stringify(htLocations)
    ),
  ]);

  const maps = await Promise.all(
    htConf?.maps?.map((m) => getFbStorage(fbDb, m.file)) ?? []
  );

  await Promise.all(
    maps.map((m) =>
      fs.promises.writeFile(`${mapsDir}/${m.file}`, Buffer.from(m.bytes))
    )
  );

  const images = [
    ...(htOrgs?.flatMap((o) => o.media?.map((m) => m.name)) ?? []),
    ...(htSpeakers?.flatMap((s) => s.media?.map((m) => m.name)) ?? []),
    ...(htEvents?.flatMap((e) => e.media?.map((m) => m.name)) ?? []),
  ].filter((i) => i != null && !i?.startsWith("https://info.defcon.org"));

  const fbImages = await Promise.all(
    images.map((i) =>
      getFbStorage(fbDb, i).catch((error) => console.error(error))
    )
  );

  await Promise.all(
    fbImages
      .filter((m) => m?.file)
      .map((m) => {
        fs.promises.writeFile(`${imgDir}/${m.file}`, Buffer.from(m.bytes));
      })
  );
})();
