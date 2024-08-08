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
        <Table className="md:text-base">
          <TableCaption>DEF CON 32 Merch</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-white text-black !py-0 h-8">
                Name
              </TableHead>
              {productSizes.map((s) => (
                <TableHead key={s} className="bg-white text-black !py-0 h-8">
                  {s}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsMultiSize.map((p) => (
              <TableRow
                key={p.fields.id.integerValue}
                className="even:bg-muted/50"
              >
                <TableHead className="font-bold text-white !py-0">
                  {p.fields.title.stringValue}
                </TableHead>
                {productSizes.map((s) => (
                  <TableCell
                    key={`${p.fields.id.integerValue}-${s}`}
                    className="!py-0"
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
        <Table className="md:text-base">
          <TableHeader>
            <TableRow className="font-bold">
              <TableHead className="bg-white text-black h-8 !py-0">
                Name
              </TableHead>
              <TableHead className="bg-white text-black h-8 !py-0">
                One-Size
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsOneSize.map((p) => (
              <TableRow
                key={p.fields.id.integerValue}
                className="even:bg-muted/50"
              >
                <TableHead className="font-bold text-white !py-0">
                  {p.fields.title.stringValue}
                </TableHead>

                <TableCell className="!py-0">
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
