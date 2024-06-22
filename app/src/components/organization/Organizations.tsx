import OrgCell from "./OrgCell";

export default function Orgs({
  orgs,
  title,
}: {
  orgs: HTOrganization[];
  title: string;
}) {
  return (
    <>
      <div className="mx-5 bg-background">
        <div className="my-10">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold font-mono">
            {title}
          </h1>
        </div>
        {orgs.map((o) => (
          <div key={o.id} className="my-5">
            {o.id != null && <OrgCell org={o} />}
          </div>
        ))}
      </div>
    </>
  );
}
