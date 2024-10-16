import { removeFromCart } from "@/app/(app)/[gender]/_actions";
import { Button } from "@/ui/button";
import { Trash2 } from "lucide-react";

type Props = {
  cartProductId: string;
};

export function DeleteProductButton({ cartProductId }: Props) {
  async function handleClick() {
    const formData = new FormData();
    formData.append("cartProductId", cartProductId);

    await removeFromCart(
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
      onClick={handleClick}
    >
      <Trash2 />
    </Button>
  );
}
