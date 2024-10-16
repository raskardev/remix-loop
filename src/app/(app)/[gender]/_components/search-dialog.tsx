"use client";

import { getProductsByName } from "@/app/(app)/[gender]/_actions";
import { ProductList } from "@/app/(app)/[gender]/_components/product-list";
import { useMediaQuery } from "@/app/hooks/use-media-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ProductByName } from "@/lib/types";
import { Button } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { Input } from "@/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const EXCLUDED_PATHS = ["/sign-in", "/sign-up"];

export function SearchDialog() {
  const pathname = usePathname();

  const show = EXCLUDED_PATHS.includes(pathname);
  if (show) return null;

  const [products, setProducts] = useState<ProductByName[] | undefined>();
  const [searchInput, setSearchInput] = useState("");
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function handleOpenChange(open: boolean) {
    setOpen(open);

    if (!open) {
      setSearchInput("");
      setProducts(undefined);
    }
  }

  async function searchAction() {
    const formData = new FormData();
    formData.append("name", searchInput);

    const { products: searchProducts } = await getProductsByName(
      {
        products: [],
      },
      formData,
    );

    setProducts(searchProducts ?? []);
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>
        {isDesktop ? (
          <Button
            className="w-52 justify-start space-x-4 rounded-2xl border-foreground"
            variant="outline"
          >
            <Search className="size-5" />
            <span>Search</span>
          </Button>
        ) : (
          <Button size="icon" variant="ghost">
            <Search />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-full h-dvh !rounded-none border-none flex flex-col">
        <VisuallyHidden>
          <DialogTitle>Search products input</DialogTitle>
          <DialogDescription>Search products</DialogDescription>
        </VisuallyHidden>
        <div className="flex items-center h-14 border-b space-x-3">
          <MagnifyingGlassIcon className="h-6 w-6" />
          <form className="w-full" action={searchAction}>
            <Input
              className="border-none outline-none focus-visible:ring-0 text-xl md:text-2xl font-semibold"
              placeholder="What are you looking for?"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
        </div>
        <ScrollArea className="flex-1 basis-0">
          {products ? (
            products.length > 0 ? (
              <ProductList products={products} />
            ) : (
              <div className="text-center">
                <h3 className="text-2xl font-bold">No products found</h3>
                <p className="mt-4">
                  Sorry, we couldn't find any products matching your search
                  criteria.
                </p>
              </div>
            )
          ) : null}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
