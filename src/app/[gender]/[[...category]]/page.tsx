import { ProductCard } from "@/app/[gender]/[[...category]]/components/product-card";
import { getProducts } from "@/lib/db/queries";
import {} from "@/lib/db/schema";
import {} from "drizzle-orm";
import { redirect } from "next/navigation";

type Props = {
  params: {
    gender: string;
    category: string[];
  };
};

export default async function CategoryGenderPage(props: Props) {
  if (props.params.category?.length > 1) redirect(`/${props.params.gender}`);

  const products = await getProducts({
    gender: props.params.gender === "man" ? "M" : "F",
    category: props.params.category,
  });

  return (
    <div>
      <div className="grid grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
