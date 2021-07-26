import { useEffect } from "react";
import { firebaseInit } from "./fb";
import { Heading } from "./Heading";
import Main from "./Main";

const HackerTracker = () => {
  firebaseInit();

  useEffect(() => {
    const updatedTime = parseInt(localStorage.getItem("updated") ?? "0", 10);
    if (updatedTime && navigator.onLine) {
      const now = new Date().getTime();
      const deltaTime = now - updatedTime;
      const timeOutMs = 1800000;
      if (deltaTime > timeOutMs) {
        localStorage.removeItem("updated");
        localStorage.removeItem("events");
        localStorage.removeItem("speakers");
      }
    }
  }, []);

  return (
    <div>
      <Heading />
      <Main />
    </div>
  );
};

export default HackerTracker;
