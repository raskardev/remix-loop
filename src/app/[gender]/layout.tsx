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
      <footer className="mt-12 h-24 flex items-center justify-center font-bold">
        ~ LOOP Copyright {new Date().getFullYear()} &copy; ~
      </footer>
    </div>
  );
}
