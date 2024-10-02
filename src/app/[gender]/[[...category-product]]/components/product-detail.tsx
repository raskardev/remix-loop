import { LikeButton } from "@/app/[gender]/[[...category-product]]/components/like-button";
import { Button } from "@/components/ui/button";
import type { getProduct } from "@/lib/db/queries";
import Image from "next/image";

type Props = {
  product: NonNullable<Awaited<ReturnType<typeof getProduct>>>;
};

export function ProductDetail({ product }: Props) {
  return (
    <div className="grid grid-cols-2 max-w-5xl mx-auto gap-10">
      <div>
        <Image
          src={product.imageUrl}
          alt={product.name ?? ""}
          width={999}
          height={100}
        />
      </div>
      <div>
        <h2 className="font-bold text-2xl">{product.name}</h2>
        <p className="text-sm text-muted-foreground">{product.description}</p>
        {/* hacer con formatter */}
        <p className="mt-4 font-bold">{product.price} €</p>
        <div className="flex gap-x-3 mt-6">
          <Button className="w-full rounded-full h-10 font-bold">
            Add to cart
          </Button>
          <LikeButton
            productVariantId={product.productVariantId}
            isLiked={product.isWishlisted}
          />
        </div>
      </div>
    </div>
  );
}
