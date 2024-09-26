"use client";

import { updateAccount, updatePassword } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/auth/middleware";
import { useUser } from "@/lib/auth/provider";
import { Loader2 } from "lucide-react";
import { useActionState } from "react";

export default function AccountPage() {
  const { user } = useUser();

  const [updateAccountState, updateAccountFormAction, updateAccountPending] =
    useActionState<ActionState, FormData>(updateAccount, {
      error: "",
      success: "",
    });

  const [updatePasswordState, updatePasswordFormAction, updatePasswordPending] =
    useActionState<ActionState, FormData>(updatePassword, {
      error: "",
      success: "",
    });

  return (
    <>
      <h2 className="text-2xl mb-4">Personal details</h2>
      <form className="space-y-6" action={updateAccountFormAction}>
        <div>
          <Label htmlFor="name" className="text-base">
            Name
          </Label>
          <div className="mt-1">
            <Input
              id="name"
              name="name"
              defaultValue={user?.name}
              autoComplete="name"
              required
              maxLength={255}
              className="appearance-none h-14 border px-3 py-2 text-base rounded-xl"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="email" className="text-base">
            Email
          </Label>
          <div className="mt-1">
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user?.email}
              autoComplete="email"
              required
              maxLength={255}
              className="appearance-none h-14 border px-3 py-2 text-base rounded-xl"
            />
          </div>
        </div>

        {updateAccountState?.error && (
          <div className="text-red-500 text-sm">{updateAccountState.error}</div>
        )}

        {updateAccountState?.success && (
          <div className="text-green-500 text-sm">
            {updateAccountState.success}
          </div>
        )}

        <Button
          type="submit"
          className="bg-white text-black h-14 w-full rounded-xl hover:text-white text-base font-bold"
        >
          {updateAccountPending ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" /> Loading...
            </>
          ) : (
            <>Update</>
          )}
        </Button>
      </form>
      <h3 className="text-xl my-4">Password</h3>
      <form className="space-y-6" action={updatePasswordFormAction}>
        <div>
          <Label htmlFor="current-password" className="text-base">
            Current password
          </Label>
          <div className="mt-1">
            <Input
              id="current-password"
              name="currentPassword"
              type="password"
              required
              defaultValue={updatePasswordState.data?.currentPassword}
              maxLength={255}
              className="appearance-none h-14 border px-3 py-2 text-base rounded-xl"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="new-password" className="text-base">
            New password
          </Label>
          <div className="mt-1">
            <Input
              id="new-password"
              name="newPassword"
              type="password"
              required
              defaultValue={updatePasswordState.data?.newPassword}
              maxLength={255}
              className="appearance-none h-14 border px-3 py-2 text-base rounded-xl"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="confirm-password" className="text-base">
            Confirm password
          </Label>
          <div className="mt-1">
            <Input
              id="confirm-password"
              name="passwordConfirm"
              type="password"
              required
              defaultValue={updatePasswordState.data?.passwordConfirm}
              maxLength={255}
              className="appearance-none h-14 border px-3 py-2 text-base rounded-xl"
            />
          </div>
        </div>

        {updatePasswordState?.error && (
          <div className="text-red-500 text-sm">
            {updatePasswordState.error}
          </div>
        )}

        {updatePasswordState?.success && (
          <div className="text-green-500 text-sm">
            {updatePasswordState.success}
          </div>
        )}

        <Button
          type="submit"
          className="bg-white text-black h-14 w-full rounded-xl hover:text-white text-base font-bold"
        >
          {updateAccountPending ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" /> Loading...
            </>
          ) : (
            <>Update password</>
          )}
        </Button>
      </form>
    </>
  );
}
