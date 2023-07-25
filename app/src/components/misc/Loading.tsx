import skullLogo from "../../../public/images/skull_200x200.png";
import Image from "next/image";

function Loading() {
  return (
    <main className="bg-black text-white">
      <div className="flex content-center h-screen">
        <Image
          src={skullLogo}
          alt="DEF CON 31 Logo"
          className="animate-spin m-auto w-16 sm:w-20 md:w-24 lg:w-28 block"
        />
      </div>
    </main>
  );
}

export default Loading;
