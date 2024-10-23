import { Password } from "@/app/(auth)/_components/password";
import { PersonalDetails } from "@/app/(auth)/_components/personal-details";
import { ShippingAddresses } from "@/app/(auth)/_components/shipping-addresses";
import { getShippingAddresses } from "../../../../app/lib/db/queries.server";

export default async function AccountPage() {
  const shippingAddresses = await getShippingAddresses();

  return (
    <div className="py-24">
      <PersonalDetails />
      <Password />
      <ShippingAddresses shippingAddresses={shippingAddresses} />
    </div>
  );
}
