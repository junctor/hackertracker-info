import Link from "next/link";
import React from "react";

function OrgCell({ org }: { org: HTOrganization }) {
  return (
    <div className="my-5 ml-2">
      <div className="table items-center text-left">
        <div className="table-cell ml-1 w-1 md:w-2">&nbsp;</div>
        <div className="ml-2 w-full">
          <Link href={`/org/?id=${org.id}`} prefetch={false}>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-left hover:text-dc-purple">
              {org.name}
            </h2>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrgCell;
