import { Password } from "@/app/(auth)/account/components/password";
import { PersonalDetails } from "@/app/(auth)/account/components/personal-details";
import { ShippingAddresses } from "@/app/(auth)/account/components/shipping-addresses";
import { getShippingAddresses } from "@/lib/db/queries";

export default async function AccountPage() {
  const shippingAddresses = await getShippingAddresses();

  return (
    <>
      <PersonalDetails />
      <Password />
      <ShippingAddresses shippingAddresses={shippingAddresses} />
    </>
  );
}
