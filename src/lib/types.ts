type ProductDetail = {
  name: string;
  description: string;
  variants: {
    imageUrl: string;
    isWishlisted: boolean;
    colorName: string;
    sizes: {
      sizeId: string;
      productVariantId: string;
      name: string;
      price: number;
      stock: number;
    }[];
  }[];
};
