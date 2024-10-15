"use client";

import { updatePassword } from "@/app/(auth)/_actions";
import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { Button } from "../../../../app/components/ui/button";
import { Input } from "../../../../app/components/ui/input";
import { Label } from "../../../../app/components/ui/label";
import type { ActionState } from "../../../../app/lib/auth/middleware";

export function Password() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updatePassword,
    {
      error: "",
      success: "",
    },
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-xl my-4">Password</h3>
      <form action={formAction} className="grid items-start gap-4">
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
              defaultValue={state.data?.currentPassword}
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
              defaultValue={state.data?.newPassword}
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
              defaultValue={state.data?.passwordConfirm}
              maxLength={255}
              className="appearance-none h-14 border px-3 py-2 text-base rounded-xl"
            />
          </div>
        </div>

        {state?.error && (
          <div className="text-red-500 text-sm">{state.error}</div>
        )}

        {state?.success && (
          <div className="text-green-500 text-sm">{state.success}</div>
        )}

        <Button
          type="submit"
          className="bg-white text-black h-14 w-full rounded-xl hover:text-white text-base font-bold"
        >
          {pending ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" /> Loading...
            </>
          ) : (
            <>Update password</>
          )}
        </Button>
      </form>
    </div>
  );
}
