import { useEffect, useMemo, useState } from "react";
import React from "react";
import Error from "@/components/misc/Error";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type StockStatus = "OUT" | "LOW" | "IN";

function statusToBadge(status: StockStatus) {
  switch (status) {
    case "IN":
      return <Badge variant="default">In Stock</Badge>;
    case "LOW":
      return <Badge variant="secondary">Low</Badge>;
    case "OUT":
    default:
      return <Badge variant="destructive">Sold Out</Badge>;
  }
}

export default function Merch({ products }: { products: FBProducts }) {
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  // auto-refresh every 2m
  useEffect(() => {
    const iv = setInterval(() => location.reload(), 120_000);
    return () => clearInterval(iv);
  }, []);

  // tick “last updated” display
  useEffect(() => {
    const iv = setInterval(() => setLastUpdated(Date.now()), 10_000);
    return () => clearInterval(iv);
  }, []);

  if (!products.documents) {
    return <Error msg="Merch is closed" />;
  }

  // sort + filter out completely sold‑out products
  const docs = useMemo(() => {
    return [...products.documents]
      .sort(
        (a, b) =>
          +a.fields.sort_order.integerValue - +b.fields.sort_order.integerValue
      )
      .filter((p) =>
        p.fields.variants.arrayValue.values.some(
          (v) => v.mapValue.fields.stock_status.stringValue !== "OUT"
        )
      );
  }, [products.documents]);

  // collect sizes (including “One‑Size”)
  const sizes = useMemo(() => {
    const map = new Map<string, number>();
    products.documents.forEach((p) =>
      p.fields.variants.arrayValue.values.forEach((v) =>
        map.set(
          v.mapValue.fields.title.stringValue,
          +v.mapValue.fields.sort_order.integerValue
        )
      )
    );
    return Array.from(map.entries())
      .sort(([, a], [, b]) => a - b)
      .map(([size]) => size);
  }, [products.documents]);

  // human‑friendly “time ago”
  const timeAgo = (ms: number) => {
    const sec = Math.round((Date.now() - ms) / 1000);
    if (sec < 60) return `${sec}s ago`;
    if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
    return `${Math.floor(sec / 3600)}h ago`;
  };

  return (
    <div className="p-6 bg-black text-white">
      <div className="flex justify-between mb-4">
        <h2 className="text-3xl font-semibold">DEF CON Merch</h2>
        <div className="text-sm text-gray-400">
          Updated {timeAgo(lastUpdated)}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg bg-gray-900">
        <Table className="min-w-[700px]">
          <TableHeader className="sticky top-0 bg-gray-800">
            <TableRow>
              <TableHead className="!py-3">Product</TableHead>
              {sizes.map((sz) => (
                <TableHead key={sz} className="!py-3 text-center">
                  {sz}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.map((p, i) => {
              return (
                <TableRow
                  key={p.fields.id.integerValue}
                  className={i % 2 === 0 ? "bg-gray-800" : ""}
                >
                  <TableCell className="flex items-center gap-3 !py-3">
                    <span className="font-medium">
                      {p.fields.title.stringValue}
                    </span>
                  </TableCell>

                  {sizes.map((sz) => {
                    const variant = p.fields.variants.arrayValue.values.find(
                      (v) => v.mapValue.fields.title.stringValue === sz
                    );
                    const status =
                      (variant?.mapValue.fields.stock_status
                        .stringValue as StockStatus) || "OUT";
                    return (
                      <TableCell key={sz} className="!py-3 text-center">
                        {statusToBadge(status)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
