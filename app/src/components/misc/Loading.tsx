/* eslint-disable @next/next/no-img-element */
function Loading() {
  return (
    <div className='flex content-center h-screen'>
      <img
        src='/static/img/skull_200x200.png'
        alt='DEF CON Logo'
        className='animate-spin m-auto w-12 sm:w-14 md:w-16 lg:w-20 block'
      />
    </div>
  );
}

export default Loading;
