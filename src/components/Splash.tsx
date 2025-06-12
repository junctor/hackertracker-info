import React from "react";
import Countdown from "@/components/countdown/Countdown";
import Image from "next/image";
import dc33Logo from "../../public/images/33-calls-header-2.webp";

export default function Splash() {
  return (
    <div className="my-14">
      <div className="flex w-full justify-center items-center text-center mt-5">
        <div>
          <Image src={dc33Logo} alt="DEF CON 33 Logo" className="" />
        </div>
      </div>
      <Countdown />
    </div>
  );
}
