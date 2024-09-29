import { LikeButton } from "@/app/[gender]/[[...category-product]]/components/like-button";
import { ProductCard } from "@/app/[gender]/[[...category-product]]/components/product-card";
import { Button } from "@/components/ui/button";
import { getProduct, getProducts } from "@/lib/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";

type Props = {
  params: {
    gender: string;
    "category-product": string[];
  };
};

export default async function CategoryGenderPage(props: Props) {
  const categorySlug = props.params["category-product"]?.[0];
  const productSlug = props.params["category-product"]?.[1];

  if (!productSlug) {
    const products = await getProducts({
      gender: props.params.gender === "man" ? "M" : "F",
      category: categorySlug,
    });

    return (
      <div>
        <div className="grid grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
          {products.map((product) => (
            <ProductCard key={product.productVariantId} product={product} />
          ))}
        </div>
      </div>
    );
  }

  const product = await getProduct(productSlug);

  if (!product) {
    redirect(`/${props.params.gender}/${categorySlug}`);
  }

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

// TODO: change for noStore() on _actions to be more specific when available
export const fetchCache = "force-no-store";
