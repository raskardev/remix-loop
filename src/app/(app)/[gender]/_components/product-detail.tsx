"use client";

import { addToCart } from "@/app/(app)/[gender]/_actions";
import { LikeButton } from "@/app/(app)/[gender]/_components/like-button";
import type { ActionState } from "@/lib/auth/middleware";
import type { ProductDetail as ProductDetailType } from "@/lib/types";
import { cn, priceToEuro } from "@/lib/utils";
import { Button } from "@/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";

type Props = {
  product: ProductDetailType;
};

type ProductColorListProps = {
  variants: ProductDetailType["variants"];
  selectedVariantId: string;
  resetKey: () => void;
};

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

function ProductColorList({
  variants,
  selectedVariantId,
  resetKey,
}: ProductColorListProps) {
  return (
    <div className="flex gap-x-3 mt-4">
      {variants.map((variant) => (
        <Link
          key={variant.colorName}
          href={`?color=${variant.colorName.toLowerCase()}`}
          className={cn("opacity-60", {
            "opacity-100": variant.productVariantId === selectedVariantId,
          })}
          onClick={resetKey}
        >
          <img
            src={variant.imageUrl}
            alt={variant.colorName ?? ""}
            className="w-16 h-auto"
          />
        </Link>
      ))}
    </div>
  );
}

export function ProductDetail({ product }: Props) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    addToCart,
    {
      error: "",
    },
  );

  const [key, setKey] = useState(+new Date());

  const searchParams = useSearchParams();
  const color = searchParams.get("color") ?? product.variants[0].colorName;

  const selectedVariant =
    product.variants.find(
      (variant) => variant.colorName.toLowerCase() === color,
    ) ?? product.variants[0];

  const formattedPrice = priceFormatter.format(
    priceToEuro(selectedVariant.sizes[0].price),
  );

  return (
    <div className="flex flex-col-reverse md:flex-row max-w-5xl mx-auto gap-10 mt-4">
      <div className="w-full">
        <img src={selectedVariant.imageUrl} alt={product.name ?? ""} />
      </div>
      <div className="w-full">
        <h2 className="font-bold text-2xl">{product.name}</h2>
        <p className="text-sm text-muted-foreground">{product.description}</p>
        <p className="mt-4 font-bold">{formattedPrice}</p>
        {product.variants.length > 1 ? (
          <ProductColorList
            variants={product.variants}
            selectedVariantId={selectedVariant.productVariantId}
            resetKey={() => setKey(+new Date())}
          />
        ) : null}
        {/* TODO: fix select to persist selected size */}
        <form action={formAction} onSubmit={() => setKey(+new Date())}>
          <input type="hidden" name="quantity" value={1} />
          <Select name="productVariantSizeId" key={key} required>
            <SelectTrigger className="w-full mt-4">
              <SelectValue placeholder="Select the size" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {selectedVariant.sizes.map((size) => {
                  return (
                    <SelectItem
                      key={size.name}
                      value={size.productVariantSizeId}
                    >
                      {size.name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex gap-x-3 mt-4">
            <Button
              className="w-full rounded-full h-10 font-bold"
              type="submit"
            >
              {pending ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" /> Loading...
                </>
              ) : (
                <>Add to cart</>
              )}
            </Button>
            <LikeButton
              productVariantId={selectedVariant.productVariantId}
              isLiked={selectedVariant.isWishlisted}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
