"use client";

import { addToCart } from "@/app/[gender]/_actions";
import { DeleteProductButton } from "@/app/[gender]/_components/delete-product-button";
import { checkoutAction } from "@/app/cart/_actions";
import type { ActionState } from "@/lib/auth/middleware";
import type { ShippingAddress, ShoppingBagItem } from "@/lib/types";
import { priceToEuro } from "@/lib/utils";
import { Button } from "@/ui/button";
import {} from "@/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

type Props = {
  shoppingBagItems: ShoppingBagItem[];
  shippingAddresses: ShippingAddress[];
};

type BagListProductProps = {
  product: ShoppingBagItem;
};

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

function BagListProduct({ product }: BagListProductProps) {
  async function handleAddOrRemove(type: "add" | "remove") {
    const newQuantity = type === "add" ? 1 : -1;

    const formData = new FormData();
    formData.append("productVariantSizeId", product.productVariantSizeId ?? "");
    formData.append("quantity", newQuantity.toString());

    addToCart({}, formData);
  }

  return (
    <li
      key={product.cartProductId}
      className="flex flex-col md:flex-row gap-4 border p-4 rounded-md"
    >
      <div className="flex gap-4">
        <Image
          quality={100}
          src={product.imageUrl ?? ""}
          alt={product.productName ?? ""}
          width={100}
          height={100}
        />
        <div className="flex flex-col">
          <span className="font-bold">{product.productName}</span>
          <span className="font-bold text-lg">
            {priceFormatter.format(priceToEuro(product.price))}
          </span>
          <span>{product.sizeName}</span>
          <span>Quantity: {product.quantity}</span>
        </div>
      </div>
      <div className="md:ml-auto flex items-start space-x-4">
        <div className="flex items-center border rounded-full overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleAddOrRemove("add")}
          >
            <Plus />
          </Button>
          <span className="h-9 w-9 flex items-center justify-center">
            {product.quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            disabled={product.quantity === 1}
            onClick={() => handleAddOrRemove("remove")}
          >
            <Minus />
          </Button>
        </div>
        <DeleteProductButton cartProductId={product.cartProductId} />
      </div>
    </li>
  );
}

export function Cart({ shippingAddresses, shoppingBagItems }: Props) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    checkoutAction,
    {
      error: "",
      success: "",
    },
  );

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  const totalPrice = priceFormatter.format(
    priceToEuro(
      shoppingBagItems.reduce(
        (acc, item) => acc + (item.price ?? 0) * item.quantity,
        0,
      ),
    ),
  );

  return (
    <>
      <h3 className="text-xl mb-4 font-bold">Shopping Bag</h3>
      <ul className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {shoppingBagItems.map((item) => (
          <BagListProduct key={item.cartProductId} product={item} />
        ))}
      </ul>
      <h3 className="text-xl my-4 font-bold">Delivery Address</h3>
      <form action={formAction}>
        <Select name="shippingAddressId" required>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Delivery address" />
          </SelectTrigger>
          <SelectContent>
            {shippingAddresses.map((address) => (
              <SelectItem key={address.id} value={address.id}>
                {address.address} {address.additionalAddress},{" "}
                {address.province}, {address.postalCode}, {address.country} -{" "}
                {address.name} {address.surnames}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="w-64 mt-4 h-12 rounded-full font-bold">
          Pay {totalPrice}
        </Button>
      </form>
    </>
  );
}
