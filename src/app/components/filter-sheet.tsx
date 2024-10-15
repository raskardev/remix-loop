import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import type { MinMaxPrices } from "@/lib/types";
import { cn, priceToEuro } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
  triggerClassName?: string;
  colors: string[];
  minMaxPrices: MinMaxPrices;
};

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

export function FilterSheet({ triggerClassName, colors, minMaxPrices }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const minRange =
    Math.round(priceToEuro(minMaxPrices?.min ?? 0)) - 10 < 0
      ? 0
      : Math.round(priceToEuro(minMaxPrices?.min ?? 0)) - 10;
  const maxRange = Math.round(priceToEuro(minMaxPrices?.max ?? 0)) + 10;

  const [min, setMin] = useState(() => minRange);
  const [max, setMax] = useState(() => maxRange);

  const searchParamsColor = searchParams.get("color");
  const searchParamsSort = searchParams.get("sort");

  function addFilter(filters: { key: string; value: string }[]) {
    const newSearchParams = new URLSearchParams(searchParams);

    for (const filter of filters) {
      newSearchParams.set(filter.key, filter.value);
    }

    router.push(`?${newSearchParams.toString()}`);
  }

  function resetFilters() {
    setMin(minRange);
    setMax(maxRange);

    const newSearchParams = new URLSearchParams();
    router.push(`?${newSearchParams.toString()}`);
  }

  return (
    <Sheet>
      <SheetTrigger className={triggerClassName}>
        <Filter />
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Filter</SheetTitle>
          <VisuallyHidden>
            <SheetDescription>
              Here you can filter your products by gender, category, and more.
            </SheetDescription>
          </VisuallyHidden>
        </SheetHeader>
        <div className="flex flex-col space-y-4 flex-1">
          <div>
            <h3 className="font-bold text-xl">Order by</h3>
            <div className="flex space-x-3 mt-4">
              <Button
                variant="outline"
                className={cn({
                  "font-bold": searchParamsSort === "price_asc",
                })}
                onClick={() => addFilter([{ key: "sort", value: "price_asc" }])}
              >
                Price low to high
              </Button>
              <Button
                variant="outline"
                className={cn({
                  "font-bold": searchParamsSort === "price_desc",
                })}
                onClick={() =>
                  addFilter([{ key: "sort", value: "price_desc" }])
                }
              >
                Price high to low
              </Button>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="font-bold text-xl">Color</h3>
            <div className="flex flex-wrap gap-3 mt-4">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    addFilter([{ key: "color", value: color.toLowerCase() }])
                  }
                >
                  <div
                    className="rounded-full size-14"
                    style={{ backgroundColor: color }}
                  />
                  <span
                    className={cn("text-muted-foreground text-sm", {
                      "text-white font-bold":
                        searchParamsColor === color.toLowerCase(),
                    })}
                  >
                    {color}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xl">Price</h3>
              <span className="text-sm">
                {priceFormatter.format(min)} - {priceFormatter.format(max)}
              </span>
            </div>
            <Slider
              multiple
              className="mt-4"
              min={minRange}
              max={maxRange}
              value={[min, max]}
              onValueChange={([minValue, maxValue]) => {
                setMin(minValue);
                setMax(maxValue);
              }}
              onValueCommit={([minValue, maxValue]) => {
                addFilter([
                  { key: "price_min", value: minValue.toString() },
                  { key: "price_max", value: maxValue.toString() },
                ]);
              }}
            />
          </div>
        </div>
        <div>
          <Separator />
          <Button
            variant="outline"
            className="w-full mt-6"
            onClick={resetFilters}
          >
            Reset filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
