import fs from "fs";
import {
  firebaseInit,
  getConference,
  getEvents,
  getSpeakers,
  getFAQ,
  getFbStorage,
  getLocations,
  getTags,
  getNews,
  getOrganizations,
} from "./fb";

const CONF = "DEFCON32";

(async () => {
  const apiKey = process.env.FIREBASE_API_KEY;

  if (apiKey === undefined) {
    console.log("FIREBASE_API_KEY environment variable is not set");
    return;
  }

  const fbDb = await firebaseInit(apiKey);

  const [
    htConf,
    htEvents,
    htSpeakers,
    htFAQ,
    htLocations,
    htTags,
    htNews,
    htOrgs,
  ] = await Promise.all([
    getConference(fbDb, CONF),
    getEvents(fbDb, CONF),
    getSpeakers(fbDb, CONF),
    getFAQ(fbDb, CONF),
    getLocations(fbDb, CONF),
    getTags(fbDb, CONF),
    getNews(fbDb, CONF),
    getOrganizations(fbDb, CONF),
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
    fs.promises.writeFile("./out/ht/faq.json", JSON.stringify(htFAQ)),
    fs.promises.writeFile("./out/ht/tags.json", JSON.stringify(htTags)),
    fs.promises.writeFile("./out/ht/news.json", JSON.stringify(htNews)),
    fs.promises.writeFile(
      "./out/ht/organizations.json",
      JSON.stringify(htOrgs)
    ),

    fs.promises.writeFile(
      "./out/ht/locations.json",
      JSON.stringify(htLocations)
    ),
  ]);

  fbDb.app.options.storageBucket = "gs://hackertest-5a202.appspot.com";

  const maps = await Promise.all(
    htConf?.maps?.map((m: any) => getFbStorage(fbDb, CONF, m.file)) ?? []
  );

  await Promise.all(
    maps.map((m) =>
      fs.promises.writeFile(`${mapsDir}/${m.file}`, Buffer.from(m.bytes))
    )
  );

  const imgs = await Promise.all(
    htOrgs?.flatMap((o: any) =>
      o.media.map((m: any) =>
        getFbStorage(fbDb, CONF, m.name).catch((error) => console.error(error))
      )
    ) ?? []
  );

  await Promise.all(
    imgs
      .filter((m) => m?.file)
      .map((m) => {
        fs.promises.writeFile(`${imgDir}/${m.file}`, Buffer.from(m.bytes));
      })
  );
})();
