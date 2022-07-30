import Link from "next/link";

function CategoryCell({ category }: CategoryCellProps) {
  return (
    <div className='my-5 ml-2'>
      <div className='flex bg-black items-center text-left'>
        <div
          className={`ml-1 w-1 md:w-2 h-7 sm:h-8 md:h-9 lg:h-10 ${`bg-[${category.color}]`}`}>
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
