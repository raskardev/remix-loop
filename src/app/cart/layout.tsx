import { Header } from "@/app/(app)/components/header";
import type { ReactNode } from "react";

export default function CartLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
