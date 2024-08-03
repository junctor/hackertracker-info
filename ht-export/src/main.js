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
} from "./fb.js";

const CONF = "DEFCON32";

(async () => {
  const fbDb = await firebaseInit();

  const [
    htConf,
    htEvents,
    htSpeakers,
    htFAQ,
    htLocations,
    htTags,
    htNews,
    htOrgs,
    htContent,
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

  const maps = await Promise.all(
    htConf?.maps?.map((m) => getFbStorage(fbDb, CONF, m.file)) ?? []
  );

  await Promise.all(
    maps.map((m) =>
      fs.promises.writeFile(`${mapsDir}/${m.file}`, Buffer.from(m.bytes))
    )
  );

  const orgImgs = await Promise.all(
    htOrgs?.flatMap((o) =>
      o.media.map((m) =>
        getFbStorage(fbDb, CONF, m.name).catch((error) => console.error(error))
      )
    ) ?? []
  );

  await Promise.all(
    orgImgs
      .filter((m) => m?.file)
      .map((m) => {
        fs.promises.writeFile(`${imgDir}/${m.file}`, Buffer.from(m.bytes));
      })
  );

  // const speakerImgs = await Promise.all(
  //   htSpeakers?.flatMap((o: any) =>
  //     o.media.map((m: any) =>
  //       getFbStorage(fbDb, CONF, m.name).catch((error) => console.error(error))
  //     )
  //   ) ?? []
  // );

  // await Promise.all(
  //   speakerImgs
  //     .filter((m) => m?.file)
  //     .map((m) => {
  //       fs.promises.writeFile(`${imgDir}/${m.file}`, Buffer.from(m.bytes));
  //     })
  // );
})();