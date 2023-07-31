import Link from "next/link";

function TagCell({ tag }: { tag: Tag }) {
  return (
    <div className="my-5 ml-2">
      <div className="table bg-black text-white items-center text-left">
        <div
          className={`table-cell ml-1 w-1 md:w-2 ${`bg-[${tag.color_background}]`}`}
        >
          &nbsp;
        </div>
        <div className="ml-2 w-full">
          <Link href={`/tag/?id=${tag.id}`} prefetch={false}>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-left">
              {tag.label}
            </h2>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TagCell;
