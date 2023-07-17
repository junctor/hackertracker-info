import skullLogo from "../../../public/images/skull_200x200.png";
import Image from "next/image";

export default function Error() {
  return (
    <div className="flex content-center h-screen">
      <Image
        src={skullLogo}
        alt="DEF CON 31 Logo"
        className="rotate-180 m-auto w-12 sm:w-14 md:w-16 lg:w-20 block"
      />
      <h1>Error</h1>
    </div>
  );
}
