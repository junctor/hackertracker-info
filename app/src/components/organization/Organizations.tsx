import Heading from "../heading/Heading";
import OrgCell from "./OrgCell";

export default function Orgs({
  orgs,
  title,
  type,
}: {
  orgs: HTOrganization[];
  title: string;
  type: string;
}) {
  return (
    <>
      <Heading />
      <div className="mx-5">
        <div className="flex my-10 sticky top-20 z-20  bg-black ">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold font-mono">
            {title}
          </h1>
        </div>
        {orgs.map((o) => (
          <div key={o.id} className="my-5">
            {o.id != null && <OrgCell org={o} type={type} />}
          </div>
        ))}
      </div>
    </>
  );
}
