import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, loginSchema } from "@/models/auth.server";
import type { ActionFunctionArgs } from "@remix-run/node";
import {
  Form,
  json,
  Link,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import { Loader2 } from "lucide-react";
export const action = async ({ request }: ActionFunctionArgs) => {
  const redirectTo = new URL(request.url).searchParams.get("redirectTo");

  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const result = loginSchema.safeParse({ email, password });

  if (!result.success) {
    return json({
      error: "Invalid email or password. Please try again.",
    });
  }

  return login({
    email: result.data.email,
    password: result.data.password,
    ...(redirectTo ? { redirectTo } : {}),
  });
};

export default function SignInPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-xs w-full relative">
        <h2 className="text-2xl font-extrabold mb-4">Sign in to Loop</h2>
        <Form className="space-y-6" method="post">
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
                maxLength={255}
                className="appearance-none h-14 border px-3 py-2 text-base rounded-xl"
              />
            </div>
          </div>

          {actionData?.error && (
            <div className="text-red-500 text-sm">{actionData.error}</div>
          )}

          <Button
            type="submit"
            className="bg-white text-black h-14 w-full rounded-xl hover:text-white text-base font-bold"
          >
            {navigation.state === "submitting" ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" /> Loading...
              </>
            ) : (
              <>Sign in</>
            )}
          </Button>
        </Form>
        <p className="mt-8 fixed bottom-4 left-1/2 -translate-x-1/2 w-full text-center">
          Don't have an account?{" "}
          <Button
            asChild
            variant="link"
            className="text-white text-base px-0 font-bold"
          >
            <Link to="/sign-up">Sign up</Link>
          </Button>
        </p>
      </div>
    </div>
  );
}
