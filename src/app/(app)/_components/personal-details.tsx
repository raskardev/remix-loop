"use client";

import { updateAccount } from "@/app/(auth)/_actions";
import type { ActionState } from "@/lib/auth/middleware";
import { useUser } from "@/lib/auth/provider";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Loader2 } from "lucide-react";
import { useActionState } from "react";

export function PersonalDetails() {
  const { user } = useUser();

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateAccount,
    {
      error: "",
      success: "",
    },
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl mb-4">Personal details</h2>
      <form action={formAction} className="grid items-start gap-4">
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
            <>Update</>
          )}
        </Button>
      </form>
    </div>
  );
}
