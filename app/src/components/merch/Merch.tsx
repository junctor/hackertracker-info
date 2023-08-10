import {
  XCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
export default function Merch({ products }: { products: FBProducts }) {
  const productsSorted = products.documents.sort(
    (a, b) =>
      a.fields.sort_order.integerValue - b.fields.sort_order.integerValue
  );

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

  setTimeout(function () {
    location.reload();
  }, 120000);

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
    <main className="bg-black text-white">
      <div className="overflow-x-auto">
        <table className="table table-xs table-pin-cols">
          <thead>
            <tr className="bg-black text-dc-purple text-xs md:text-sm font-extrabold">
              <th>Name</th>
              {productSizes.map((s) => (
                <th key={s}>{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productsMultiSize.map((p) => (
              <tr key={p.fields.id.integerValue}>
                <th className="bg-black">{p.fields.title.stringValue}</th>
                {productSizes.map((s) => (
                  <td
                    key={`${p.fields.id.integerValue}-${s}`}
                    className="text-center"
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
                            <XCircleIcon className="w-5 md:w-6 lg:w-7 text-dc-red" />
                          );
                        case "LOW":
                          return (
                            <ExclamationTriangleIcon className="w-5 md:w-6 lg:w-7 text-dc-yellow" />
                          );
                        case "IN":
                          return (
                            <CheckCircleIcon className="w-5 md:w-6 lg:w-7 text-dc-teal" />
                          );
                        default:
                          return (
                            <QuestionMarkCircleIcon className="w-5 md:w-6 lg:w-7 text-dc-purple" />
                          );
                      }
                    })()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <thead className="mt-1">
            <tr className="bg-black text-dc-purple text-xs md:text-sm font-extrabold">
              <th>Name</th>
              <th>One-Size</th>
            </tr>
          </thead>
          <tbody>
            {productsOneSize.map((p) => (
              <tr key={p.fields.id.integerValue}>
                <th className="bg-black">{p.fields.title.stringValue}</th>

                <td className="text-center">
                  {(() => {
                    switch (
                      p.fields.variants.arrayValue.values.find(
                        (v) =>
                          v.mapValue.fields.title.stringValue === "One-Size"
                      )?.mapValue.fields.stock_status.stringValue ??
                      "OUT"
                    ) {
                      case "OUT":
                        return (
                          <XCircleIcon className="w-5 md:w-6 lg:w-7 text-dc-red" />
                        );
                      case "LOW":
                        return (
                          <ExclamationTriangleIcon className="w-5 md:w-6 lg:w-7 text-dc-yellow" />
                        );
                      case "IN":
                        return (
                          <CheckCircleIcon className="w-5 md:w-6 lg:w-7 text-dc-teal" />
                        );
                      default:
                        return (
                          <QuestionMarkCircleIcon className="w-5 md:w-6 lg:w-7 text-dc-purple" />
                        );
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
