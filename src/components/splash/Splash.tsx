import React from "react";
import Countdown from "@/components/countdown/Countdown";
import Image from "next/image";
import dcsLogo from "../../../public/images/dcsingapore.webp";
import { TARGET_DATE_MS } from "@/lib/timer";

export default function Splash() {
  return (
    <main className="py-16 max-w-6xl mx-auto px-4">
      {/* Hero */}
      <div className="text-center space-y-4 align-middle items-center justify-center flex flex-col">
        <Image src={dcsLogo} alt="DEF CON Singapore 2025" priority />
        <Countdown />
      </div>

      {TARGET_DATE_MS < Date.now().valueOf() && <Countdown />}
    </main>
  );
}
