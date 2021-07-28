import { useEffect } from "react";
import { firebaseInit, updatedDate } from "./fb";
import { Heading } from "./Heading";
import Main from "./Main";

const HackerTracker = () => {
  firebaseInit();

  useEffect(() => {
    (async () => {
      if (navigator.onLine) {
        const fbUpdatedDate = await updatedDate();
        const fbUpdatedTime = new Date(fbUpdatedDate).getTime();

        const cacheUpdatedTime = parseInt(
          localStorage.getItem("updated") ?? "0",
          10
        );
        if (fbUpdatedTime > cacheUpdatedTime) {
          localStorage.removeItem("updated");
          localStorage.removeItem("events");
          localStorage.removeItem("speakers");
        }
      }
    })();
  }, []);

  return (
    <div>
      <Heading />
      <Main />
    </div>
  );
};

export default HackerTracker;
