import { Header } from "@/app/(auth)/_components/header";
import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="h-dvh">
      <Header />
      {children}
    </div>
  );
}
