import { CategorySelector } from "@/app/components/category-selector";
import { UserButton } from "@/app/components/user-button";
import { Button } from "@/components/ui/button";
import { getMainCategories } from "@/lib/db/queries";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Menu } from "lucide-react";
import Link from "next/link";

export async function Header() {
  const categories = await getMainCategories();

  return (
    <header className="sticky top-0 z-50 bg-transparent w-full px-12">
      <div className="h-24 grid grid-cols-3 items-center">
        <Menu color="white" />
        <Link
          href="/"
          className="text-4xl text-white uppercase font-bold justify-self-center"
        >
          LOOP
        </Link>
        <div className="flex items-center gap-x-6 justify-self-end">
          <Button
            className="w-52 justify-start space-x-4 rounded-2xl border-foreground"
            variant="outline"
          >
            <MagnifyingGlassIcon />
            <span>Search</span>
          </Button>
          <UserButton />
        </div>
      </div>
      <CategorySelector categories={categories} />
    </header>
  );
}
