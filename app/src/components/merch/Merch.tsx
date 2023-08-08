export default function Merch({ products }: { products: FBProducts }) {
  return (
    <main className="bg-black text-white">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Sizes</th>
            </tr>
          </thead>
          <tbody>
            {products.documents.map((p) => (
              <tr key={p.fields.id.integerValue}>
                <th>{p.fields.title.stringValue}</th>
                <td>
                  {p.fields.variants.arrayValue.values
                    .map((v) => v.mapValue.fields.title.stringValue)
                    .join(",")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
