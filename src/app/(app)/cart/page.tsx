import { Cart } from "@/app/(app)/cart/components/cart";
import { getShippingAddresses, getShoppingBagItems } from "@/lib/db/queries";

export default async function CartPage() {
  const [shoppingBagItems, shippingAddresses] = await Promise.all([
    getShoppingBagItems(),
    getShippingAddresses(),
  ]);

  return (
    <>
      <h2 className="text-3xl mb-4 font-bold">Payment</h2>
      <Cart
        shippingAddresses={shippingAddresses}
        shoppingBagItems={shoppingBagItems}
      />
    </>
  );
}
