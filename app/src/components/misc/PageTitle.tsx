function PageTitle({ title }: { title: string }) {
  return (
    <div className='flex items-center justify-center mb-5'>
      <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold font-mono'>
        {title}
      </h1>
    </div>
  );
}

export default PageTitle;
