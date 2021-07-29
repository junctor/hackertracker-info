import { useEffect } from "react";
import { firebaseInit } from "./fb";
import { Heading } from "./Heading";
import Main from "./Main";
import { invalidateCache } from "./utils";

const HackerTracker = () => {
  firebaseInit();

  useEffect(() => {
    (async () => {
      await invalidateCache();
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
