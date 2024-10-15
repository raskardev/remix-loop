import { Label } from "../../../../app/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../app/components/ui/radio-group";
import { getShippingAddresses } from "../../../../app/lib/db/queries";

export default async function AddressPage() {
  const shippingAddresses = await getShippingAddresses();

  return (
    <>
      <h2 className="text-3xl mb-4 font-bold">Delivery Address</h2>
      <p>Choose your preferred delivery address for this order.</p>
      <RadioGroup defaultValue={shippingAddresses[0].id} className="mt-4">
        {shippingAddresses.map((address) => (
          <div key={address.id} className="flex items-center space-x-2">
            <RadioGroupItem value={address.id} id={address.id} />
            <Label htmlFor={address.id} className="font-bold">
              {address.name}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </>
  );
}
