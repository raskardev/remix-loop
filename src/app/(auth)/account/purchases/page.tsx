import { Separator } from "@/components/ui/separator";
import { getPurchases } from "@/lib/db/queries";
import { priceToEuro } from "@/lib/utils";
import Link from "next/link";

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

export default async function PurchasesPage() {
  const purchases = await getPurchases();

  return (
    <div className="pb-24 max-w-xl mx-auto">
      <h2 className="text-2xl mb-4 font-bold">Purchases</h2>
      <div className="flex flex-col space-y-4">
        {Array.from(purchases).map(([date, purchases]) => (
          <div key={date} className="border rounded-md p-4">
            <h3 className="font-bold text-center">{date}</h3>
            <Separator className="my-3" />
            <ul className="space-y-3">
              {purchases.map((purchase) => {
                const genderSlug = purchase.gender === "M" ? "man" : "woman";
                const href = `/${genderSlug}/${purchase.categorySlug}/${purchase.productSlug}?color=${purchase.colorName?.toLowerCase()}`;

                return (
                  <li key={purchase.id} className="flex space-x-3">
                    <Link href={href} className="underline">
                      <img
                        className="h-24 w-auto"
                        src={purchase.imageUrl ?? ""}
                        alt={purchase.productName ?? ""}
                      />
                    </Link>
                    <div className="flex flex-col">
                      <Link href={href} className="underline">
                        {purchase.productName} - {purchase.sizeName}
                      </Link>
                      <span className="font-bold">
                        {priceFormatter.format(
                          priceToEuro(purchase.productPrice),
                        )}
                      </span>
                      <span className="text-sm">
                        x{purchase.quantity} units
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
