import dc31Logo from "../../../public/images/defcon31-logo-gradient.webp";
import Image from "next/image";

function HeadingLogo() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }} className="mb-2">
      <Image src={dc31Logo} alt="DEF CON 31 Logo" className="w-24" />
    </div>
  );
}

export default HeadingLogo;
