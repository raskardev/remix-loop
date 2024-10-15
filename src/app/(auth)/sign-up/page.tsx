"use client";

import { signUp } from "@/app/(auth)/_actions";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { Button } from "../../../../app/components/ui/button";
import { Input } from "../../../../app/components/ui/input";
import { Label } from "../../../../app/components/ui/label";
import type { ActionState } from "../../../../app/lib/auth/middleware";
import { useUser } from "../../../../app/lib/auth/provider";

export default function SignUpPage() {
  const { user } = useUser();

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    signUp,
    {
      error: "",
    },
  );

  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-xs w-full relative">
        <h2 className="text-2xl font-extrabold mb-4">Sign up to Loop</h2>
        <form className="space-y-6" action={formAction}>
          <div>
            <Label htmlFor="email" className="text-base">
              Name
            </Label>
            <div className="mt-1">
              <Input
                id="name"
                name="name"
                autoComplete="name"
                required
                defaultValue={state.data?.name}
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
                autoComplete="email"
                required
                defaultValue={state.data?.email}
                maxLength={255}
                className="appearance-none h-14 border px-3 py-2 text-base rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-base">
              Password
            </Label>
            <div className="mt-1">
              <Input
                id="password"
                name="password"
                type="password"
                required
                defaultValue={state.data?.password}
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

          <Button
            type="submit"
            className="bg-white text-black h-14 w-full rounded-xl hover:text-white text-base font-bold"
          >
            {pending ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" /> Loading...
              </>
            ) : (
              <>Sign up</>
            )}
          </Button>
        </form>
        <p className="mt-8 fixed bottom-4 left-1/2 -translate-x-1/2 w-full text-center">
          Already have an account?{" "}
          <Button
            asChild
            variant="link"
            className="text-white text-base px-0 font-bold"
          >
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </p>
      </div>
    </div>
  );
}
