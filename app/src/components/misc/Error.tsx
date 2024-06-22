import Link from "next/link";

export default function Error({ msg }: { msg?: string }) {
  return (
    <main>
      <div className="flex content-center h-screen justify-center items-center text-center">
        <Link href="/">
          <div>
            <h1 className=" text-2xl md:text-4xl">Error</h1>
            <h4 className="text-xs md:text-sm">{msg ?? ""}</h4>
            <h3 className="text-base md:text-md">Return Home</h3>
          </div>
        </Link>
      </div>
    </main>
  );
}
