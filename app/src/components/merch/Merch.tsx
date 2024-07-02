import { useEffect } from "react";
import React from "react";
import Error from "@/components/misc/Error";

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
    <main>
      <div>
        <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
          Merch
        </h1>
        <table className="border-collapse border-spacing-x-4 border-spacing-y-2 border-2 border-indigo-900">
          <thead>
            <tr className="bg-white text-dc-purple text-xs md:text-lg font-extrabold">
              <th className="border-2 border-indigo-900 p-2">Name</th>
              {productSizes.map((s) => (
                <th key={s} className="border-2 border-indigo-900 p-2">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productsMultiSize.map((p) => (
              <tr
                key={p.fields.id.integerValue}
                className="odd:bg-dc-purple even:bg-black"
              >
                <th className=" border-2 border-indigo-900">
                  {p.fields.title.stringValue}
                </th>
                {productSizes.map((s) => (
                  <td
                    key={`${p.fields.id.integerValue}-${s}`}
                    className="text-center border-2 border-indigo-900 p-2"
                  >
                    {(() => {
                      switch (
                        p.fields.variants.arrayValue.values.find(
                          (v) => v.mapValue.fields.title.stringValue === s
                        )?.mapValue.fields.stock_status.stringValue ??
                        "OUT"
                      ) {
                        case "OUT":
                          return <></>;
                        case "LOW":
                          return <p className="text-dc-yellow">{s}</p>;
                        case "IN":
                          return <p className="text-dc-teal">{s}</p>;
                        default:
                          return <p>?</p>;
                      }
                    })()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <thead className="mt-1">
            <tr className="bg-white text-dc-purple text-xs md:text-lg font-extrabold">
              <th className="border-2 border-indigo-900">Name</th>
              <th className="border-2 border-indigo-900">One-Size</th>
            </tr>
          </thead>
          <tbody>
            {productsOneSize.map((p) => (
              <tr
                key={p.fields.id.integerValue}
                className="odd:bg-dc-purple even:bg-black"
              >
                <th className="">{p.fields.title.stringValue}</th>

                <td className="text-center border-2 border-indigo-900 p-2">
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
                        return <p className="text-dc-yellow">OS</p>;
                      case "IN":
                        return <p className="text-dc-teal">OS</p>;
                      default:
                        return <p>?</p>;
                    }
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
