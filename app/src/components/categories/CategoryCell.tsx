import Link from "next/link";

function CategoryCell({ category }: { category: HTEventType }) {
  return (
    <div className="my-5 ml-2">
      <div className="table bg-black items-center text-left">
        <div
          className={`table-cell ml-1 w-1 md:w-2 ${`bg-[${category.color}]`}`}
        >
          &nbsp;
        </div>
        <div className="ml-2 w-full">
          <Link href={`/category/?id=${category.id}`} prefetch={false}>
            <button
              type="button"
              className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-left"
            >
              {category.name}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CategoryCell;
