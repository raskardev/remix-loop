"use client";
import { LikeButton } from "@/app/[gender]/[[...category-product]]/components/like-button";
import type { getProducts } from "@/lib/db/queries";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  product: Awaited<ReturnType<typeof getProducts>>[number];
};

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

export function ProductCard({ product }: Props) {
  const pathname = usePathname();

  const formattedPrice = priceFormatter.format(product.price);

  const genderSlug = pathname.split("/")[1];

  return (
    <div>
      <Link
        href={`/${genderSlug}/${product.categorySlug}/${product.productSlug}`}
        key={product.productVariantId}
      >
        <Image
          src={product.imageUrl}
          alt={product.name ?? ""}
          width={999}
          height={999}
        />
      </Link>
      <div className="mt-3 relative">
        <span className="block text-center text-sm">{product.name}</span>
        <span className="block text-center font-bold">{formattedPrice}</span>
        <div className="absolute top-0 right-0 z-50">
          <LikeButton
            productVariantId={product.productVariantId}
            isLiked={product.isWishlisted}
          />
        </div>
      </div>
    </div>
  );
}
