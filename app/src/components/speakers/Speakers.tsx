import { useEffect, useRef } from "react";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/router";

export default function Speakers({ speakers }: { speakers: Speaker[] }) {
  const router = useRouter();

  return (
    <>
      <div className="mx-5 bg-background">
        <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
          Speakers
        </h1>
        <Table>
          <TableCaption>Speaker</TableCaption>
          <TableBody>
            {speakers
              .sort((a, b) =>
                a.name.toLowerCase() > b.name.toLowerCase() ? 0 : -1
              )
              .map((s) => (
                <TableRow
                  key={s.id}
                  onClick={() => router.push(`/speaker?id=${s.id}`)}
                >
                  <TableCell>{s.name}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
