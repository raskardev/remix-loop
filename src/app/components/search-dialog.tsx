"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";

const EXCLUDED_PATHS = ["/sign-in", "/sign-up"];

export function SearchDialog() {
  const pathname = usePathname();

  const show = EXCLUDED_PATHS.includes(pathname);
  if (show) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="w-52 justify-start space-x-4 rounded-2xl border-foreground"
          variant="outline"
        >
          <MagnifyingGlassIcon />
          <span>Search</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-full h-dvh !rounded-none border-none">
        <div className="flex items-center h-14 border-b space-x-3">
          <MagnifyingGlassIcon className="h-6 w-6" />
          <Input
            className="border-none outline-none focus-visible:ring-0 text-2xl font-semibold fon"
            placeholder="What are you looking for?"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
