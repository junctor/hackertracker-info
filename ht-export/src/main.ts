import fs from "fs";
import {
  firebaseInit,
  getConference,
  getConfEvents,
  getSpeakerData,
} from "./fb";

const CONF = "DEFCON29";

(async () => {
  const fbDb = await firebaseInit();

  const [htConf, htEvents, htSpeakers] = await Promise.all([
    getConference(fbDb, CONF),
    getConfEvents(fbDb, CONF),
    getSpeakerData(fbDb, CONF),
  ]);

  const outputDir = "./out";
  if (!fs.existsSync(outputDir)) {
    fs.promises.mkdir(outputDir);
  }

  await Promise.all([
    fs.promises.writeFile("./out/conference.json", JSON.stringify(htConf)),
    fs.promises.writeFile("./out/events.json", JSON.stringify(htEvents)),
    fs.promises.writeFile("./out/speakers.json", JSON.stringify(htSpeakers)),
  ]);
})();
