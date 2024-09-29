"use client";
import { addProductToWishlist } from "@/app/[gender]/[[...category-product]]/_actions";
import { Button } from "@/components/ui/button";
import type { ActionState } from "@/lib/auth/middleware";
import { Heart } from "lucide-react";
import { useActionState } from "react";

type Props = {
  productVariantId: string;
  isLiked: boolean;
};

export function LikeButton({ productVariantId, isLiked }: Props) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    addProductToWishlist,
    {
      error: "",
      success: "",
    },
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="productVariantId" value={productVariantId} />
      <input type="hidden" name="action" value={isLiked ? "remove" : "add"} />
      <Button
        size="icon"
        variant="outline"
        className="rounded-full p-2 size-10"
      >
        <Heart className={isLiked ? "text-red-500 fill-red-500" : ""} />
      </Button>
    </form>
  );
}
