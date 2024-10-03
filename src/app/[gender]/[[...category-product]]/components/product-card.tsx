import { LikeButton } from "@/app/[gender]/[[...category-product]]/components/like-button";
import type { getProducts } from "@/lib/db/queries";
import Image from "next/image";
import Link from "next/link";

type Props = {
  product: Awaited<ReturnType<typeof getProducts>>[number];
};

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

export function ProductCard({ product }: Props) {
  const formattedPrice = priceFormatter.format(product.price ?? 0);

  const genderPath = product.gender === "M" ? "man" : "woman";

  const href = `/${genderPath}/${product.categorySlug}/${product.productSlug}?color=${product.colorName?.toLowerCase()}`;

  return (
    <div>
      <Link href={href} key={product.productVariantId}>
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
