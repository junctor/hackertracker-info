import { useEffect } from "react";
import React from "react";
import Error from "@/components/misc/Error";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/router";
import { XCircleIcon } from "@heroicons/react/16/solid";

export default function Merch({ products }: { products: FBProducts }) {
  useEffect(() => {
    const interval = setInterval(() => {
      location.reload();
    }, 120000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (products.documents == null) {
    return <Error msg="Merch is closed" />;
  }

  const router = useRouter();
  const { s } = router.query;

  const productsSorted =
    products.documents
      ?.sort(
        (a, b) =>
          a.fields.sort_order.integerValue - b.fields.sort_order.integerValue
      )
      ?.filter((p) =>
        p.fields.variants.arrayValue.values.find(
          (v) => v.mapValue.fields.stock_status.stringValue !== "OUT"
        )
      ) ?? [];

  const productsOneSize = productsSorted.filter((p) =>
    p.fields.variants.arrayValue.values.find(
      (v) => v.mapValue.fields.title.stringValue === "One-Size"
    )
  );

  const productsMultiSize = productsSorted.filter((p) =>
    p.fields.variants.arrayValue.values.find(
      (v) => v.mapValue.fields.title.stringValue !== "One-Size"
    )
  );

  const productSizes = Array.from(
    productsMultiSize
      .flatMap((p) => p.fields.variants.arrayValue.values)
      .reduce((arr, curr) => {
        arr.set(
          curr.mapValue.fields.title.stringValue,
          curr.mapValue.fields.sort_order.integerValue
        );
        return arr;
      }, new Map<string, number>())
  )
    .sort((a, b) => a[1] - b[1])
    .map((s) => s[0]);

  return (
    <>
      {s !== "os" ? (
        <Table>
          <TableCaption>DEF CON 32 Merch</TableCaption>
          <TableHeader>
            <TableRow className="font-bold text-sm lg:text-base">
              <TableHead className="min-w-60 bg-white text-black">
                Name
              </TableHead>
              {productSizes.map((s) => (
                <TableHead key={s} className="bg-white text-black">
                  {s}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsMultiSize.map((p) => (
              <TableRow key={p.fields.id.integerValue}>
                <TableHead className="font-bold text-white">
                  {p.fields.title.stringValue}
                </TableHead>
                {productSizes.map((s) => (
                  <TableCell
                    className="text-sm lg:text-base"
                    key={`${p.fields.id.integerValue}-${s}`}
                  >
                    {(() => {
                      switch (
                        p.fields.variants.arrayValue.values.find(
                          (v) => v.mapValue.fields.title.stringValue === s
                        )?.mapValue.fields.stock_status.stringValue ??
                        "OUT"
                      ) {
                        case "OUT":
                          return (
                            <XCircleIcon className="size-5 text-red-500" />
                          );
                        case "LOW":
                          return <p className="text-yellow-300">{s}</p>;
                        case "IN":
                          return <p className="text-green-500">{s}</p>;
                        default:
                          return <p className="text-red-500">?</p>;
                      }
                    })()}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="font-bold text-sm lg:text-base">
              <TableHead className="min-w-60 bg-white text-black">
                Name
              </TableHead>
              <TableHead className="bg-white text-black">One-Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsOneSize.map((p) => (
              <TableRow key={p.fields.id.integerValue}>
                <TableHead className="font-bold text-white">
                  {p.fields.title.stringValue}
                </TableHead>

                <TableCell className="text-sm lg:text-base">
                  {(() => {
                    switch (
                      p.fields.variants.arrayValue.values.find(
                        (v) =>
                          v.mapValue.fields.title.stringValue === "One-Size"
                      )?.mapValue.fields.stock_status.stringValue ??
                      "OUT"
                    ) {
                      case "OUT":
                        return <></>;
                      case "LOW":
                        return <p className="text-yellow-300">OS</p>;
                      case "IN":
                        return <p className="text-green-500">OS</p>;
                      default:
                        return <p className="text-red-500">?</p>;
                    }
                  })()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
