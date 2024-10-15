import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 w-full h-24 px-12 bg-transparent flex items-center justify-center">
      <Link href="/" className="text-4xl text-white uppercase font-bold">
        LOOP
      </Link>
    </header>
  );
}
