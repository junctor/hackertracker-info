import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/router";

export default function Orgs({
  orgs,
  title,
}: {
  orgs: HTOrganization[];
  title: string;
}) {
  const router = useRouter();

  return (
    <>
      <div className="mx-5 bg-background">
        <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
          {title}
        </h1>
        <Table>
          <TableCaption>{title}</TableCaption>
          <TableBody>
            {orgs.map((o) => (
              <TableRow
                key={o.id}
                onClick={() => router.push(`/org/?id=${o.id}`)}
              >
                <TableCell>
                  <Avatar>
                    <AvatarImage src={`/ht/img/${o.logo.name}`} />
                    <AvatarFallback>{o.name[0]}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{o.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
