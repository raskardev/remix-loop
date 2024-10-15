import { removeFromCart } from "@/app/[gender]/_actions";
import { Trash2 } from "lucide-react";
import { Button } from "../../../../app/components/ui/button";

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
