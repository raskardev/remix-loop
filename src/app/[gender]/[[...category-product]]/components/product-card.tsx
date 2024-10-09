import { LikeButton } from "@/app/[gender]/[[...category-product]]/components/like-button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { cn, priceToEuro } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type Props = {
  product: Product;
};

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

export function ProductCard({ product }: Props) {
  const formattedPrice = priceFormatter.format(priceToEuro(product.price));

  const genderPath = product.gender === "M" ? "man" : "woman";

  const href = `/${genderPath}/${product.categorySlug}/${product.productSlug}?color=${product.colorName?.toLowerCase()}`;

  const isNew =
    new Date(product.createdAt).getTime() >=
    new Date().getTime() - 10 * 24 * 60 * 60 * 1000;

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
      <div className="mt-3 flex items-center justify-between px-3">
        <Badge className={cn(isNew ? "visible" : "invisible")}>NEW</Badge>
        <div>
          <span className="block text-center text-sm">{product.name}</span>
          <span className="block text-center font-bold">{formattedPrice}</span>
        </div>
        <div className="">
          <LikeButton
            productVariantId={product.productVariantId}
            isLiked={product.isWishlisted}
          />
        </div>
      </div>
    </div>
  );
}
