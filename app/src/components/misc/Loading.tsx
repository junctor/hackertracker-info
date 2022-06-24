/* eslint-disable @next/next/no-img-element */
export function Loading() {
  return (
    <div className='mx-auto content-center'>
      <img
        src='/static/img/skull_600x600.png'
        alt='DEF CON Logo'
        className='animate-pulse mx-auto object-cover '
      />
    </div>
  );
}

export default Loading;
