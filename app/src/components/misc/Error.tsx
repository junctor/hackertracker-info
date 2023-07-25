import skullLogo from "../../../public/images/skull_200x200.png";
import Image from "next/image";

import Link from "next/link";

export default function Error({ msg }: { msg?: string }) {
  return (
    <main className="bg-black text-white">
      <div className="flex content-center h-screen justify-center items-center text-center">
        <Link href="/">
          <div>
            <Image
              src={skullLogo}
              alt="DEF CON 31 Logo"
              className="rotate-180 m-auto w-16 sm:w-20 md:w-24 lg:w-28 block"
            />
            <h1 className=" text-2xl md:text-4xl">Error</h1>
            <h4 className="text-xs md:text-sm">{msg ?? ""}</h4>
            <h3 className="text-base md:text-md">Return Home</h3>
          </div>
        </Link>
      </div>
    </main>
  );
}
