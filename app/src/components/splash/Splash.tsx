import React, { useEffect } from "react";
import Countdown from "../countdown/Countdown";
import Image from "next/image";
import dc32Logo from "../../../public/images/dc32-logo-2color-halftonegradient.webp";
import { useRouter } from "next/navigation";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    if (new Date() > new Date("2024-08-09T09:00:00-07:00")) {
      router.push("/events");
    }
  }, []);

  return (
    <div className="my-14">
      <div className="flex w-full justify-center items-center text-center mt-5">
        <div>
          <Image
            src={dc32Logo}
            alt="DEF CON 32 Logo"
            className="md:w-96 w-64"
          />
        </div>
      </div>
      <Countdown />
    </div>
  );
}
