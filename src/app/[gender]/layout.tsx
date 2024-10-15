import { Header } from "@/app/[gender]/_components/header";
import type { ReactNode } from "react";

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
