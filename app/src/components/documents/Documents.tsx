import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/router";

export default function Documents({ docs }: { docs: HTDocument[] }) {
  const router = useRouter();

  return (
    <>
      <div className="mx-5 bg-background">
        <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
          Documents
        </h1>
        <Table>
          <TableCaption>Documents</TableCaption>
          <TableBody>
            {docs.map((d) => (
              <TableRow
                key={d.id}
                onClick={() => router.push(`/doc/?id=${d.id}`)}
              >
                <TableCell>{d.title_text}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
