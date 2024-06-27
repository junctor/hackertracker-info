import fs from "fs";
import {
  firebaseInit,
  getConference,
  getEvents,
  getSpeakers,
  getFAQ,
  getMaps,
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
  const childDir = "./out/ht/maps";

  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true });
  }

  fs.mkdirSync(childDir, { recursive: true });

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
    htConf?.maps?.map((m: any) => getMaps(fbDb, CONF, m.file)) ?? []
  );

  await Promise.all(
    maps.map((m) =>
      fs.promises.writeFile(`${childDir}/${m.file}`, Buffer.from(m.bytes))
    )
  );
})();
