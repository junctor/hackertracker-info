import fs from "fs";
import {
  firebaseInit,
  getConference,
  getConfEvents,
  getSpeakerData,
  getConfFAQ,
  getMaps,
  getLocationData,
  getTags,
} from "./fb";

const CONF = "DEFCON31";

(async () => {
  const fbDb = await firebaseInit();

  const [htConf, htEvents, htSpeakers, htFAQ, htLocations, htTags] =
    await Promise.all([
      getConference(fbDb, CONF),
      getConfEvents(fbDb, CONF),
      getSpeakerData(fbDb, CONF),
      getConfFAQ(fbDb, CONF),
      getLocationData(fbDb, CONF),
      getTags(fbDb, CONF),
    ]);

  const outputDir = "./out";
  const conDir = "./out/ht";
  const mapsDir = "./out/ht/maps";

  fs.rmSync(outputDir, { recursive: true });

  const dirs = [outputDir, conDir, mapsDir];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });

  await Promise.all([
    fs.promises.writeFile("./out/ht/conference.json", JSON.stringify(htConf)),
    fs.promises.writeFile("./out/ht/events.json", JSON.stringify(htEvents)),
    fs.promises.writeFile("./out/ht/speakers.json", JSON.stringify(htSpeakers)),
    fs.promises.writeFile("./out/ht/faq.json", JSON.stringify(htFAQ)),
    fs.promises.writeFile("./out/ht/tags.json", JSON.stringify(htTags)),

    fs.promises.writeFile(
      "./out/ht/locations.json",
      JSON.stringify(htLocations)
    ),
  ]);

  fbDb.app.options.storageBucket = "gs://hackertest-5a202.appspot.com";

  const maps = await Promise.all(
    htConf?.maps?.map((m) => getMaps(fbDb, CONF, m.file)) ?? []
  );

  await Promise.all(
    maps.map((m) =>
      fs.promises.writeFile(`${mapsDir}/${m.file}`, Buffer.from(m.bytes))
    )
  );
})();
