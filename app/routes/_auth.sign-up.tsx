import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { signUp, signUpSchema } from "@/models/auth.server";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");
  const passwordConfirm = formData.get("passwordConfirm");

  const result = signUpSchema.safeParse({
    email,
    password,
    name,
    passwordConfirm,
  });

  if (!result.success) {
    return json({
      errors: result.error.flatten(),
    });
  }

  return signUp({
    email: result.data.email,
    password: result.data.password,
    name: result.data.name,
    passwordConfirm: result.data.passwordConfirm,
  });
};

export default function SignUpPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-xs w-full relative">
        <h2 className="text-2xl font-extrabold mb-4">Sign up to Loop</h2>
        <Form className="space-y-6" method="POST">
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
                maxLength={255}
                className="appearance-none h-14 border px-3 py-2 text-base rounded-xl"
              />
            </div>
          </div>

          {actionData && "errors" in actionData
            ? Object.entries(actionData.errors.fieldErrors).map((error) => (
                <div key={error[0]} className="text-red-500 text-sm">
                  {error[1][0]}
                </div>
              ))
            : null}

          <Button
            type="submit"
            className="bg-white text-black h-14 w-full rounded-xl hover:text-white text-base font-bold"
          >
            {navigation.state === "submitting" ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" /> Loading...
              </>
            ) : (
              <>Sign up</>
            )}
          </Button>
        </Form>
        <p className="mt-8 fixed bottom-4 left-1/2 -translate-x-1/2 w-full text-center">
          Already have an account?{" "}
          <Button
            asChild
            variant="link"
            className="text-white text-base px-0 font-bold"
          >
            <Link to="/sign-in">Sign in</Link>
          </Button>
        </p>
      </div>
    </div>
  );
}
