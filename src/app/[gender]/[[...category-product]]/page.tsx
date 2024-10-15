import { ProductDetail } from "@/app/[gender]/[[...category-product]]/components/product-detail";
import { ProductList } from "@/app/[gender]/[[...category-product]]/components/product-list";
import { getProduct, getProducts } from "@/lib/db/queries";
import { redirect } from "next/navigation";

type Props = {
  params: {
    gender: string;
    "category-product": string[];
  };
  searchParams: {
    sort: string;
    color: string;
    price_min: string;
    price_max: string;
  };
};

export default async function CategoryGenderPage(props: Props) {
  const categorySlug = props.params["category-product"]?.[0];
  const productSlug = props.params["category-product"]?.[1];

  if (!productSlug) {
    const products = await getProducts({
      gender: props.params.gender === "man" ? "M" : "F",
      category: categorySlug,
      orderBy: props.searchParams.sort,
      color: props.searchParams.color,
      priceMin: props.searchParams.price_min
        ? +props.searchParams.price_min * 100
        : undefined,
      priceMax: props.searchParams.price_max
        ? +props.searchParams.price_max * 100
        : undefined,
    });

    return <ProductList products={products} />;
  }

  const product = await getProduct(productSlug);

  if (!product) {
    redirect(`/${props.params.gender}/${categorySlug}`);
  }

  return <ProductDetail product={product} />;
}
