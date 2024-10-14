import { ProductCard } from "@/app/[gender]/[[...category-product]]/components/product-card";
import type { Product } from "@/lib/types";

type Props = {
  products: Product[];
};

export function ProductList({ products }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
      {products.map((product) => (
        <ProductCard key={product.productVariantId} product={product} />
      ))}
    </div>
  );
}
