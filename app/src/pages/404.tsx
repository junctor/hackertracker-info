import Heading from "../components/heading/Heading";

export default function FourOhFour({ title }: { title: string | null }) {
  return (
    <div>
      <Heading />
      <h1>404 - {title ? title : "Page Not Found"}</h1>
    </div>
  );
}
