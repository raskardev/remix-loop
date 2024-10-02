"use client";

import { addToCart } from "@/app/[gender]/[[...category-product]]/_actions";
import { LikeButton } from "@/app/[gender]/[[...category-product]]/components/like-button";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ActionState } from "@/lib/auth/middleware";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

type Props = {
  product: ProductDetail;
};

type ProductColorListProps = {
  variants: ProductDetail["variants"];
  selectedVariantId: string;
};

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

function ProductColorList({
  variants,
  selectedVariantId,
}: ProductColorListProps) {
  return (
    <div className="flex gap-x-3 mt-4">
      {variants.map((variant) => (
        <Link
          key={variant.colorName}
          href={`?color=${variant.colorName.toLowerCase()}`}
          className={cn("opacity-60", {
            "opacity-100":
              variant.sizes[0].productVariantId === selectedVariantId,
          })}
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

  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [key, setKey] = useState(+new Date());

  const searchParams = useSearchParams();
  const color = searchParams.get("color") ?? product.variants[0].colorName;

  const selectedVariant =
    product.variants.find(
      (variant) => variant.colorName.toLowerCase() === color,
    ) ?? product.variants[0];

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setSelectedSize(undefined);
    setKey(+new Date());
  }, [selectedVariant]);

  const selectedProductVariantId = selectedVariant.sizes.find(
    (size) => size.sizeId === selectedSize,
  )?.productVariantId;

  const formattedPrice = priceFormatter.format(selectedVariant.sizes[0].price);

  return (
    <div className="grid grid-cols-2 max-w-5xl mx-auto gap-10">
      <div>
        <Image
          src={selectedVariant.imageUrl}
          alt={product.name ?? ""}
          width={999}
          height={100}
        />
      </div>
      <div>
        <h2 className="font-bold text-2xl">{product.name}</h2>
        <p className="text-sm text-muted-foreground">{product.description}</p>
        <p className="mt-4 font-bold">{formattedPrice}</p>
        {product.variants.length > 1 ? (
          <ProductColorList
            variants={product.variants}
            selectedVariantId={selectedVariant.sizes[0].productVariantId}
          />
        ) : null}
        <form action={formAction}>
          <input
            type="hidden"
            name="productVariantId"
            value={
              selectedProductVariantId ??
              selectedVariant.sizes[0].productVariantId
            }
          />
          <input type="hidden" name="quantity" value={1} />
          <Select
            name="size"
            required
            key={key}
            value={selectedSize}
            onValueChange={setSelectedSize}
          >
            <SelectTrigger className="w-full mt-4">
              <SelectValue placeholder="Select the size" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {selectedVariant.sizes.map((size) => (
                  <SelectItem key={size.name} value={size.sizeId}>
                    {size.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex gap-x-3 mt-4">
            <Button
              className="w-full rounded-full h-10 font-bold"
              type="submit"
            >
              Add to cart
            </Button>
            <LikeButton
              productVariantId={
                selectedProductVariantId ??
                selectedVariant.sizes[0].productVariantId
              }
              isLiked={selectedVariant.isWishlisted}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
