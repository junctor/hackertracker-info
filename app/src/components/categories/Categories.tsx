import Heading from "../heading/Heading";
import CategoryCell from "./CategoryCell";

export default function Categories({ tags }: { tags: HTTag[] }) {
  return (
    <>
      <Heading />
      <div className="mx-5">
        {tags
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((t) => (
            <div key={t.id}>
              <div className="flex my-10 sticky top-20 z-20  bg-black ">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold font-mono">
                  {t.label}
                </h1>
              </div>
              {t.tags
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((c) => (
                  <div key={c.id} className="my-5">
                    {c.id != null && <CategoryCell category={c} />}
                  </div>
                ))}
            </div>
          ))}
      </div>
    </>
  );
}
