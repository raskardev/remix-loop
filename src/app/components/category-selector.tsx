"use client";

import { FilterSheet } from "@/app/components/filter-sheet";
import { useMediaQuery } from "@/app/hooks/use-media-query";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import type { Category, MinMaxPrices } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  categories: Category[];
  colors: string[];
  minMaxPrices: MinMaxPrices;
};

const EXCLUDED_PATHS = ["/", "/sign-in", "/sign-up", "/account"];

function DesktopCategoryLink({ category }: { category: Category }) {
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

function MobileCategoryLink({ category }: { category: Category }) {
  const pathname = usePathname();

  const genderSlug = pathname.split("/")[1];
  const categorySlug = pathname.split("/")[2] || "_";

  const active = categorySlug === category.slug;

  const href = `/${genderSlug}${category.slug === "_" ? "" : `/${category.slug}`}`;

  return (
    <li>
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuLink
          className={cn(
            "inline-block bg-muted text-foreground px-4 w-full py-2 text-sm rounded-lg",
            { "bg-foreground text-background": active },
          )}
        >
          {category.name}
        </NavigationMenuLink>
      </Link>
    </li>
  );
}

export function CategorySelector({ categories, colors, minMaxPrices }: Props) {
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const show =
    EXCLUDED_PATHS.includes(pathname) || pathname.split("/").length >= 4;
  if (show) return null;

  const allItems: Category = {
    id: "0",
    name: "All",
    slug: "_",
  };

  if (isDesktop) {
    return (
      <div className="h-12 relative">
        <ul className="flex space-x-4 items-center justify-center">
          <DesktopCategoryLink category={allItems} />
          {categories.map((category) => (
            <DesktopCategoryLink key={category.id} category={category} />
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

  return (
    <div className="flex items-center justify-between">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <MobileCategoryLink category={allItems} />
                {categories.map((category) => (
                  <MobileCategoryLink key={category.id} category={category} />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <FilterSheet colors={colors} minMaxPrices={minMaxPrices} />
    </div>
  );
}
