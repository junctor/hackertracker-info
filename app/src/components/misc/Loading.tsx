/* eslint-disable @next/next/no-img-element */
function Loading() {
  return (
    <div className='flex content-center h-screen'>
      <img
        src='/static/img/skull_200x200.png'
        alt='DEF CON Logo'
        className='animate-spin m-auto w-14 sm:w-16 md:w-20 lg:w-24 block'
      />
    </div>
  );
}

export default Loading;
