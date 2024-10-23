import { ProductDetail } from "@/app/[gender]/_components/product-detail";
import { ProductList } from "@/app/[gender]/_components/product-list";
import { redirect } from "next/navigation";
import {
  getMainCategories,
  getProduct,
  getProducts,
} from "../../../../app/lib/db/queries.server";

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
  if (!["woman", "man"].includes(props.params.gender)) {
    redirect("/");
  }

  const categorySlug = props.params["category-product"]?.[0];

  const categories = (await getMainCategories()).map(
    (category) => category.slug,
  );

  if (categorySlug && !categories.includes(categorySlug)) {
    redirect(`/${props.params.gender}`);
  }

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
