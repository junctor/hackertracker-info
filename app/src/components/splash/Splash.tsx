import Countdown from "../countdown/Countdown";
import Links from "./Links";
import Image from "next/image";
import dc31Logo from "../../../public/images/defcon31-logo-gradient.webp";
import localFont from "next/font/local";

const freewayFont = localFont({
  src: "../../../public/fonts/freeway-gothic.woff2",
  display: "swap",
  variable: "--font-freeway",
});

export default function Splash() {
  const kickoffTimestamp = 1691769600 * 1000;
  return (
    <div className="my-12">
      <div className="flex w-full justify-center items-center text-center mt-5">
        <div>
          <Image
            src={dc31Logo}
            alt="DEF CON 31 Logo"
            className="md:w-96 w-64 relative"
          />
        </div>
      </div>
      <div className="text-center mt-2">
        <div
          className={`font-extrabold text-md md:text-xl text-dc-text ${freewayFont.className} mb-2`}
        >
          The Future Will Prevail
        </div>
      </div>
      {new Date(kickoffTimestamp) > new Date() && <Countdown />}
      <Links />
    </div>
  );
}
