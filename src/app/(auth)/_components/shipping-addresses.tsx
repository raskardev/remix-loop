"use client";

import { deleteShippingAddressAction } from "@/app/(auth)/_actions";
import { AddShippingAddressModal } from "@/app/(auth)/_components/add-shipping-address-modal";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../app/components/ui/alert-dialog";
import { Button } from "../../../../app/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../app/components/ui/card";
import type { ShippingAddress } from "../../../../app/lib/types";

type Props = {
  shippingAddresses: ShippingAddress[];
};

type ShippingAddressCardProps = {
  shippingAddress: ShippingAddress;
};

function ShippingAddressCard({ shippingAddress }: ShippingAddressCardProps) {
  async function handleDelete() {
    const formData = new FormData();
    formData.append("shippingAddressId", shippingAddress.id);

    await deleteShippingAddressAction(
      {
        error: "",
        success: "",
      },
      formData,
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{shippingAddress.address}</CardTitle>
        <CardDescription>
          {shippingAddress.population} - {shippingAddress.province} -{" "}
          {shippingAddress.postalCode} - {shippingAddress.country}
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-end space-x-3">
        <AddShippingAddressModal
          type="edit"
          shippingAddress={shippingAddress}
          trigger={
            <Button
              size="icon"
              variant="ghost"
              type="button"
              className="size-5"
            >
              <Pencil className="text-blue-500" />
            </Button>
          }
        />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              type="button"
              className="size-5"
            >
              <Trash2 className="text-red-500" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                address.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}

export function ShippingAddresses({ shippingAddresses }: Props) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-xl my-4">Shipping Addresses</h3>
        <AddShippingAddressModal
          type="add"
          trigger={
            <Button variant="outline" size="icon">
              <Plus />
            </Button>
          }
        />
      </div>
      {shippingAddresses.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You don't have any shipping addresses yet.
        </p>
      ) : (
        <div className="grid grid-cols md:grid-cols-2 gap-4 mt-4">
          {shippingAddresses.map((shippingAddress) => (
            <ShippingAddressCard
              key={shippingAddress.id}
              shippingAddress={shippingAddress}
            />
          ))}
        </div>
      )}
    </div>
  );
}
