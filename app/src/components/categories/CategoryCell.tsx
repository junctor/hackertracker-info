import Link from "next/link";
import {
  VideoCameraIcon,
  ChatAltIcon,
  AnnotationIcon,
} from "@heroicons/react/outline";

function CategoryCell({ category }: CategoryCellProps) {
  return (
    <div className='my-2 ml-2 mr-3'>
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
        <div className='flex mr-2'>
          {category.youtube_url && (
            <a href={category.youtube_url}>
              <VideoCameraIcon className='h-5 sm:h-6 md:h-7 lg:h-8 mx-1' />
            </a>
          )}
          {category.discord_url && (
            <a href={category.discord_url}>
              <ChatAltIcon className='h-5 sm:h-6 md:h-7 lg:h-8 mx-1' />
            </a>
          )}
          {category.subforum_url && (
            <a href={category.subforum_url}>
              <AnnotationIcon className='h-5 sm:h-6 md:h-7 lg:h-8 mx-1' />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryCell;
