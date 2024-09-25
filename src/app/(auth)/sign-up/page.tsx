import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="flex items-center justify-center min-h-dvh">
      <div className="max-w-xs w-full">
        <h2 className="text-2xl font-extrabold mb-4">Sign up to Loop</h2>
        <form className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-base">
              Name
            </Label>
            <div className="mt-1">
              <Input
                id="name"
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
                type="email"
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
                type="password"
                required
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
                type="password"
                required
                maxLength={255}
                className="appearance-none h-14 border px-3 py-2 text-base rounded-xl"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="bg-white text-black h-14 w-full rounded-xl hover:text-white text-base font-bold"
          >
            Sign up
          </Button>
        </form>
        <p className="mt-8">
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
    </main>
  );
}
