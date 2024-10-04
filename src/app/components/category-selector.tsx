"use client";

import { FilterSheet } from "@/app/components/filter-sheet";
import type { getLowerAndUpperPrices } from "@/lib/db/queries";
import type { Category } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  categories: Category[];
  colors: string[];
  minMaxPrices: Awaited<ReturnType<typeof getLowerAndUpperPrices>>;
};

const EXCLUDED_PATHS = ["/", "/sign-in", "/sign-up", "/account"];

function CategoryLink({ category }: { category: Category }) {
  const pathname = usePathname();

  const genderSlug = pathname.split("/")[1];
  const categorySlug = pathname.split("/")[2] || "_";

  const active = categorySlug === category.slug;

  const href = `/${genderSlug}${category.slug === "_" ? "" : `/${category.slug}`}`;

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "inline-block bg-muted text-foreground px-4 py-2 text-sm rounded-lg",
          { "bg-foreground text-background": active },
        )}
      >
        {category.name}
      </Link>
    </li>
  );
}

export function CategorySelector({ categories, colors, minMaxPrices }: Props) {
  const pathname = usePathname();

  const show =
    EXCLUDED_PATHS.includes(pathname) || pathname.split("/").length >= 4;
  if (show) return null;

  const allItems: Category = {
    id: "0",
    name: "All",
    slug: "_",
    parentId: null,
    active: true,
  };

  return (
    <div className="h-12 relative">
      <ul className="flex space-x-4 items-center justify-center">
        <CategoryLink category={allItems} />
        {categories.map((category) => (
          <CategoryLink key={category.id} category={category} />
        ))}
      </ul>
      <FilterSheet
        triggerClassName="absolute right-0 top-0 h-12"
        colors={colors}
        minMaxPrices={minMaxPrices}
      />
    </div>
  );
}
