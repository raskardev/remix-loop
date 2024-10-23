import { logout } from "@/models/auth.server";
import { redirect, type ActionFunctionArgs } from "@remix-run/node";

export async function loader() {
  return redirect("/");
}

export async function action({ request }: ActionFunctionArgs) {
  return logout({ request });
}
