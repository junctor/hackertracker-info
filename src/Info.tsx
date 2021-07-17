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
      const hourMs = 3600000;
      if (deltaTime > hourMs) {
        localStorage.removeItem("updated");
        localStorage.removeItem("events");
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
