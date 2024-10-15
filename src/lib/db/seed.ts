import { db } from "@/lib/db/drizzle";
import {
  type NewCategory,
  categoriesSchema,
  colorsSchema,
  productVariantSizes,
  productVariantsSchema,
  productsSchema,
  sizesSchema,
} from "@/lib/db/schema";

async function seedCategories() {
  const categoriesToInsert: NewCategory[] = [
    {
      id: "1",

      name: "Jeans and trousers",
      slug: "jeans-and-trousers",
      active: true,
    },
    {
      id: "2",
      name: "Sweatshirts and knitwear",
      slug: "sweatshirts-and-knitwear",
      active: true,
    },
    {
      id: "3",
      name: "Jackets and coats",
      slug: "jackets-and-coats",
      active: true,
    },
    {
      id: "4",
      name: "T-shirts and shirts",
      slug: "t-shirts-and-shirts",
      active: true,
    },
    {
      id: "5",
      name: "Shoes",
      slug: "shoes",
      active: true,
    },
    {
      id: "6",
      name: "Bags and accessories",
      slug: "bags-and-accessories",
      active: true,
    },
  ];

  const categories = await db
    .insert(categoriesSchema)
    .values(categoriesToInsert)
    .returning();

  const categoriesObject = categories.reduce(
    (acc, category) => {
      acc[category.slug] = category.id;
      return acc;
    },
    {} as Record<string, string>,
  );

  return categoriesObject;
}

async function seedColors() {
  const colorsToInsert = [
    {
      id: "1",
      name: "White",
    },
    {
      id: "2",
      name: "Black",
    },
    {
      id: "3",
      name: "Blue",
    },
    {
      id: "4",
      name: "Green",
    },
    {
      id: "5",
      name: "Red",
    },
    {
      id: "6",
      name: "Gray",
    },
  ];

  const colors = await db
    .insert(colorsSchema)
    .values(colorsToInsert)
    .returning();

  const colorsObject = colors.reduce(
    (acc, color) => {
      acc[color.name.toLowerCase()] = color.id;
      return acc;
    },
    {} as Record<string, string>,
  );

  return colorsObject;
}

async function seedSizes() {
  const sizesToInsert = [
    {
      id: "1",
      name: "S",
    },
    {
      id: "2",
      name: "M",
    },
    {
      id: "3",
      name: "L",
    },
    {
      id: "4",
      name: "XL",
    },
    {
      id: "5",
      name: "XXL",
    },
  ];

  const sizes = await db.insert(sizesSchema).values(sizesToInsert).returning();

  const sizesObject = sizes.reduce(
    (acc, size) => {
      acc[size.name.toLowerCase()] = size.id;
      return acc;
    },
    {} as Record<string, string>,
  );

  return sizesObject;
}

async function seedProducts(
  categories: Record<string, string>,
  colors: Record<string, string>,
  sizes: Record<string, string>,
) {
  const products = [
    {
      id: "1",
      name: "Baggy tracksuit bottoms",
      description:
        "Baggy jogger tracksuit bottoms with a rubberised logo, side pockets and an elasticated drawstring waistband. Made of cotton.",
      price: 2299,
      categoryId: categories["jeans-and-trousers"],
      slug: "baggy-tracksuit-bottoms",
      targetGender: "M",
      productVariants: [
        {
          id: "1",
          colorId: colors.green,
          productId: "1",
          imageUrl:
            "https://static.pullandbear.net/assets/public/7766/62e6/034c4a5ebcde/7fe27b18cf5e/07679901500-A6M/07679901500-A6M.jpg?ts=1725893597870&w=1125",
          productVariantSizes: [
            {
              id: "1",
              productVariantId: "1",
              sizeId: sizes.s,
              stock: 10,
            },
            {
              id: "2",
              productVariantId: "1",
              sizeId: sizes.m,
              stock: 10,
            },
            {
              id: "3",
              productVariantId: "1",
              sizeId: sizes.l,
              stock: 10,
            },
          ],
        },
        {
          id: "2",
          colorId: colors.black,
          productId: "1",
          imageUrl:
            "https://static.pullandbear.net/assets/public/e711/a908/e3dc474da4ac/eb8d68fd74fe/07679501800-A6M/07679501800-A6M.jpg?ts=1725367917538&w=1125",
          productVariantSizes: [
            {
              id: "4",
              productVariantId: "2",
              sizeId: sizes.s,
              stock: 10,
            },
            {
              id: "5",
              productVariantId: "2",
              sizeId: sizes.m,
              stock: 10,
            },
            {
              id: "6",
              productVariantId: "2",
              sizeId: sizes.l,
              stock: 10,
            },
          ],
        },
      ],
    },
    {
      id: "2",
      name: "STWD hoodie",
      description:
        "STWD cotton hoodie with a print detail and pouch pocket with piped seams.",
      price: 2999,
      categoryId: categories["sweatshirts-and-knitwear"],
      slug: "stwd-hoodie",
      targetGender: "M",
      productVariants: [
        {
          id: "3",
          colorId: colors.black,
          productId: "2",
          imageUrl:
            "https://static.pullandbear.net/assets/public/c63f/d5a2/27b54365bd51/2d7fef148a6d/07590535800-A6M/07590535800-A6M.jpg?ts=1724065788507&w=1125",
          productVariantSizes: [
            {
              id: "7",
              productVariantId: "3",
              sizeId: sizes.s,
              stock: 10,
            },
            {
              id: "8",
              productVariantId: "3",
              sizeId: sizes.m,
              stock: 10,
            },
            {
              id: "9",
              productVariantId: "3",
              sizeId: sizes.l,
              stock: 10,
            },
          ],
        },
      ],
    },
    {
      id: "3",
      name: "Hooded STWD puffer jacket",
      description:
        "Puffer jacket with STWD embroidery, a hood, side pockets and zip fastening. Available in assorted colours.",
      price: 3999,
      categoryId: categories["jackets-and-coats"],
      slug: "hooded-stwd-puffer-jacket",
      targetGender: "M",
      productVariants: [
        {
          id: "4",
          colorId: colors.blue,
          productId: "3",
          imageUrl:
            "https://static.pullandbear.net/assets/public/5b27/b3c4/013d49d9a741/ec3a78eede13/07710570400-A6M/07710570400-A6M.jpg?ts=1726589415573&w=1125",
          productVariantSizes: [
            {
              id: "10",
              productVariantId: "4",
              sizeId: sizes.s,
              stock: 10,
            },
            {
              id: "11",
              productVariantId: "4",
              sizeId: sizes.m,
              stock: 10,
            },
            {
              id: "12",
              productVariantId: "4",
              sizeId: sizes.l,
              stock: 10,
            },
          ],
        },
        {
          id: "5",
          colorId: colors.red,
          productId: "3",
          imageUrl:
            "https://static.pullandbear.net/assets/public/3c97/23a2/dd2a4f368dae/a62b16008420/07710570600-A6M/07710570600-A6M.jpg?ts=1726589387919&w=1125",
          productVariantSizes: [
            {
              id: "13",
              productVariantId: "5",
              sizeId: sizes.s,
              stock: 10,
            },
            {
              id: "14",
              productVariantId: "5",
              sizeId: sizes.m,
              stock: 10,
            },
            {
              id: "15",
              productVariantId: "5",
              sizeId: sizes.l,
              stock: 10,
            },
          ],
        },
      ],
    },
    {
      id: "4",
      name: "Loose baggy jeans",
      description:
        "Loose fit baggy jeans with belt loops, a five-pocket design and zip fly and top button fastening.",
      price: 2999,
      categoryId: categories["jeans-and-trousers"],
      slug: "loose-baggy-jeans",
      targetGender: "M",
      productVariants: [
        {
          id: "16",
          colorId: colors.gray,
          productId: "4",
          imageUrl:
            "https://static.pullandbear.net/assets/public/af8d/caa8/faca4b498110/03e5fee98763/07685523922-A6M/07685523922-A6M.jpg?ts=1720012390767&w=1125",
          productVariantSizes: [
            {
              id: "16",
              productVariantId: "16",
              sizeId: sizes.s,
              stock: 10,
            },
            {
              id: "17",
              productVariantId: "16",
              sizeId: sizes.m,
              stock: 10,
            },
            {
              id: "18",
              productVariantId: "16",
              sizeId: sizes.l,
              stock: 10,
            },
          ],
        },
      ],
    },
  ];

  for (const product of products) {
    await db.insert(productsSchema).values({
      id: product.id,
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      price: product.price,
      slug: product.slug,
      active: true,
      targetGender: product.targetGender as "M" | "F",
    });

    for (const productVariant of product.productVariants) {
      await db.insert(productVariantsSchema).values({
        id: productVariant.id,
        productId: product.id,
        colorId: productVariant.colorId,
        imageUrl: productVariant.imageUrl,
      });

      for (const productVariantSize of productVariant.productVariantSizes) {
        await db.insert(productVariantSizes).values({
          id: productVariantSize.id,
          productVariantId: productVariant.id,
          sizeId: productVariantSize.sizeId,
          stock: productVariantSize.stock,
        });
      }
    }
  }
}

async function seed() {
  const [categories, colors, sizes] = await Promise.all([
    seedCategories(),
    seedColors(),
    seedSizes(),
  ]);

  await seedProducts(categories, colors, sizes);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Seed process finished. Exiting...");
    process.exit(0);
  });
