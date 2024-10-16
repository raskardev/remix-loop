import { Password } from "@/app/(app)/_components/password";
import { PersonalDetails } from "@/app/(app)/_components/personal-details";
import { ShippingAddresses } from "@/app/(app)/_components/shipping-addresses";
import { getShippingAddresses } from "@/lib/db/queries";

export default async function AccountPage() {
  const shippingAddresses = await getShippingAddresses();

  return (
    <div>
      <PersonalDetails />
      <Password />
      <ShippingAddresses shippingAddresses={shippingAddresses} />
    </div>
  );
}
