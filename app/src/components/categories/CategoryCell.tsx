import Link from "next/link";

function CategoryCell({ category }: CategoryCellProps) {
  return (
    <div className='my-5 ml-5'>
      <div className='flex bg-black items-center'>
        <div
          className={`ml-1 w-2 h-10 ${
            category.color === "#ababa"
              ? "bg-dc-pink"
              : `bg-[${category.color}]`
          }`}>
          &nbsp;
        </div>
        <div className='w-11/12 ml-2'>
          <Link href={`/categories/${category.id}`} prefetch={false}>
            <button
              type='button'
              className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold'>
              {category.name}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CategoryCell;
