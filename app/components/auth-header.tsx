import { Link } from "@remix-run/react";

export function AuthHeader() {
  return (
    <header className="fixed left-0 top-0 w-full h-24 px-12 bg-transparent flex items-center justify-center">
      <Link to="/" className="text-4xl text-white uppercase font-bold">
        LOOP
      </Link>
    </header>
  );
}
