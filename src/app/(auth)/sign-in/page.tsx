"use client";

import { signIn } from "@/app/(auth)/_actions";
import type { ActionState } from "@/lib/auth/middleware";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

export default function SignInPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    signIn,
    {
      error: "",
    },
  );

  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-xs w-full relative">
        <h2 className="text-2xl font-extrabold mb-4">Sign in to Loop</h2>
        <form className="space-y-6" action={formAction}>
          <div>
            <Label htmlFor="email" className="text-base">
              Email
            </Label>
            <div className="mt-1">
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={state.data?.email}
                autoComplete="email"
                required
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
                defaultValue={state.data?.password}
                required
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
              <>Sign in</>
            )}
          </Button>
        </form>
        <p className="mt-8 fixed bottom-4 left-1/2 -translate-x-1/2 w-full text-center">
          Don't have an account?{" "}
          <Button
            asChild
            variant="link"
            className="text-white text-base px-0 font-bold"
          >
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </p>
      </div>
    </div>
  );
}
