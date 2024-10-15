import { Cart } from "@/app/cart/components/cart";
import { getShippingAddresses, getShoppingBagItems } from "@/lib/db/queries";

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

export default async function CartPage() {
  const [shoppingBagItems, shippingAddresses] = await Promise.all([
    getShoppingBagItems(),
    getShippingAddresses(),
  ]);

  const totalPrice = shoppingBagItems.reduce(
    (acc, item) => acc + (item.price ?? 0) * item.quantity,
    0,
  );

  return (
    <>
      <h2 className="text-3xl mb-4 font-bold">Payment</h2>
      <Cart
        shippingAddresses={shippingAddresses}
        shoppingBagItems={shoppingBagItems}
      />
      {/* <ul className="flex flex-col gap-4">
        {shoppingBagItems.map((item) => (
          <BagListProduct key={item.cartProductId} product={item} />
        ))}
      </ul>
      <Button className="w-64 mt-4 h-12 rounded-full font-bold" asChild>
        <Link href="/cart/address">
          Process order of {priceFormatter.format(priceToEuro(totalPrice))}
        </Link>
      </Button> */}
    </>
  );
}
