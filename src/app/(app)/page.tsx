import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-dvh grid grid-cols-1 md:grid-cols-2 absolute inset-0">
      <Link
        href="/woman"
        className="relative flex items-center justify-center group overflow-hidden bg-[url(/woman.jpg)] bg-cover bg-center"
      >
        <div className="absolute bg-black/20 inset-0 group-hover:bg-transparent duration-300" />
        <h2 className="text-7xl text-white z-10">Woman</h2>
      </Link>
      <Link
        href="/man"
        className="relative flex items-center justify-center group overflow-hidden bg-[url(/man.jpg)] bg-cover bg-center"
      >
        <div className="absolute bg-black/20 inset-0 group-hover:bg-transparent duration-300" />
        <h2 className="text-7xl text-white z-10">Man</h2>
      </Link>
    </div>
  );
}
