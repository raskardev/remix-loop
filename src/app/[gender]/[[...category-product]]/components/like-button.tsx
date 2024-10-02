"use client";
import { addProductToWishlist } from "@/app/[gender]/[[...category-product]]/_actions";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

type Props = {
  productVariantId: string;
  isLiked: boolean;
};

export function LikeButton({ productVariantId, isLiked }: Props) {
  async function handleOnClick() {
    const formData = new FormData();
    formData.append("productVariantId", productVariantId);
    formData.append("action", isLiked ? "remove" : "add");

    await addProductToWishlist(
      {
        error: "",
        success: "",
      },
      formData,
    );
  }

  return (
    <Button
      size="icon"
      variant="outline"
      className="rounded-full p-2 size-10"
      type="button"
      onClick={handleOnClick}
    >
      <Heart className={isLiked ? "text-red-500 fill-red-500" : ""} />
    </Button>
  );
}
