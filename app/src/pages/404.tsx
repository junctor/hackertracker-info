export default function FourOhFour({ title }: { title: string | null }) {
  return (
    <div>
      <h1>404 - {title || "Page Not Found"}</h1>
    </div>
  );
}
