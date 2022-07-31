import fs from "fs";
import {
  firebaseInit,
  getConference,
  getConfEvents,
  getSpeakerData,
  getConfFAQ,
  getMaps,
  getLocationData,
} from "./fb";

const CONF = "DEFCON30";

(async () => {
  const fbDb = await firebaseInit();

  const [htConf, htEvents, htSpeakers, htFAQ, htLocations] = await Promise.all([
    getConference(fbDb, CONF),
    getConfEvents(fbDb, CONF),
    getSpeakerData(fbDb, CONF),
    getConfFAQ(fbDb, CONF),
    getLocationData(fbDb, CONF),
  ]);

  const outputDir = "./out";
  if (!fs.existsSync(outputDir)) {
    fs.promises.mkdir(outputDir);
  }

  const conDir = "./out/con";
  if (!fs.existsSync(conDir)) {
    fs.promises.mkdir(conDir);
  }

  const mapsDir = "./out/con/maps";
  if (!fs.existsSync(mapsDir)) {
    fs.promises.mkdir(mapsDir);
  }

  await Promise.all([
    fs.promises.writeFile("./out/con/conference.json", JSON.stringify(htConf)),
    fs.promises.writeFile("./out/con/events.json", JSON.stringify(htEvents)),
    fs.promises.writeFile(
      "./out/con/speakers.json",
      JSON.stringify(htSpeakers)
    ),
    fs.promises.writeFile("./out/con/faq.json", JSON.stringify(htFAQ)),
    fs.promises.writeFile(
      "./out/con/locations.json",
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
