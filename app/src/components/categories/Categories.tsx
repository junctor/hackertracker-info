import Heading from "../heading/Heading";
import CategoryCell from "./CategoryCell";

const Categories = ({ categories }: CategoriesProps) => {
  return (
    <>
      <Heading />
      {Array.from(categories)
        .sort((a, b) => {
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          } else {
            return -1;
          }
        })
        .map((c) => (
          <div key={c.data?.id}>
            {c.data && <CategoryCell category={c.data} />}
          </div>
        ))}
    </>
  );
};

export default Categories;
