import { UserButton } from "@/components/user-button";
import { Link } from "@remix-run/react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-transparent w-full">
      <div className="h-24 flex items-center relative">
        <Link
          to="/"
          className="text-xl md:text-4xl text-white uppercase font-bold justify-self-center md:absolute md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2"
        >
          LOOP
        </Link>
        <div className="flex items-center justify-self-end gap-x-4 ml-auto">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
