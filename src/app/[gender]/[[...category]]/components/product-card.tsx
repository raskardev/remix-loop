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
  const formattedPrice = priceFormatter.format(product.price);

  return (
    <Link href="/" key={product.id} className="group">
      <Image
        src={product.imageUrl}
        alt={product.name ?? ""}
        width={999}
        height={999}
      />
      <div className="mt-3">
        <span className="block text-center text-sm">{product.name}</span>
        <span className="block text-center font-bold">{formattedPrice}</span>
      </div>
    </Link>
  );
}
