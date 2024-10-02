import { ProductCard } from "@/app/[gender]/[[...category-product]]/components/product-card";
import type { getProducts } from "@/lib/db/queries";

type Props = {
  products: Awaited<ReturnType<typeof getProducts>>;
};

export async function ProductList({ products }: Props) {
  return (
    <div className="grid grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
      {products.map((product) => (
        <ProductCard key={product.productVariantId} product={product} />
      ))}
    </div>
  );
}
