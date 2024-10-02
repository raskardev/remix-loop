type ProductDetail = {
  name: string;
  description: string;
  variants: {
    imageUrl: string;
    isWishlisted: boolean;
    productVariantId: string;
    colorName: string;
    sizes: {
      sizeId: string;
      productVariantSizeId: string;
      name: string;
      price: number;
      stock: number;
    }[];
  }[];
};
