import { ProductDetail } from "@/app/[gender]/[[...category-product]]/components/product-detail";
import { ProductList } from "@/app/[gender]/[[...category-product]]/components/product-list";
import { getProduct, getProducts } from "@/lib/db/queries";
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

    return <ProductList products={products} />;
  }

  const product = await getProduct(productSlug);

  if (!product) {
    redirect(`/${props.params.gender}/${categorySlug}`);
  }

  return <ProductDetail product={product} />;
}
