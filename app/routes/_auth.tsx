import { AuthHeader } from "@/components/auth-header";
import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <div className="h-dvh">
      <AuthHeader />
      <Outlet />
    </div>
  );
}
