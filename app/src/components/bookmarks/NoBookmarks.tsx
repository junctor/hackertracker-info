import { StarIcon } from "@heroicons/react/outline";

function NoBookmarks() {
  return (
    <div className='mt-10 mx-8 text-center'>
      <h1 className='font-bold text-base md:text-lg lg:text-xl'>
        You have have no bookmarks!
      </h1>
      <p className='mt-10 text-sm md:text-base lg:text-lg items-center align-middle'>
        Use the <StarIcon className='w-5 inline' /> icon to bookmark events.
      </p>
    </div>
  );
}

export default NoBookmarks;
