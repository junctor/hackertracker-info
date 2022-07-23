import Heading from "../heading/Heading";
import CategoryCell from "./CategoryCell";

function Categories({ categories }: CategoriesProps) {
  return (
    <>
      <Heading />
      <div className='mx-5'>
        <div className='flex items-center justify-center mb-5'>
          <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold font-mono'>
            Categories
          </h1>
        </div>
        {Array.from(categories)
          .sort((a, b) => {
            if (a.name.toLowerCase() > b.name.toLowerCase()) {
              return 1;
            }
            return -1;
          })
          .map((c) => (
            <div key={c.data?.id ?? 0}>
              {c.data && <CategoryCell category={c.data} />}
            </div>
          ))}
      </div>
    </>
  );
}

export default Categories;
