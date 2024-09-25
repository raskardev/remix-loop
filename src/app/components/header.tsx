import { Menu, User } from "lucide-react";
import Link from "next/link";
import colors from "tailwindcss/colors";

export function Header() {
  return (
    <header className="fixed top-0 z-50 bg-transparent w-full py-8 bg-red-500 flex items-center justify-between px-12">
      <Menu color="white" />
      <Link
        href="/"
        className="text-4xl text-white uppercase font-bold flex items-center gap-x-3"
      >
        NAME
        {/* <InfinityIcon color="white" />
        Loop
        <InfinityIcon color="white" /> */}
      </Link>
      <Link href="/sign-in">
        <User color={colors.white} />
      </Link>
    </header>
  );
}
