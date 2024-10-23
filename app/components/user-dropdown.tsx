import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIndexLoaderData } from "@/routes/_index";
import { Link, useFetcher } from "@remix-run/react";
import { CircleAlert, CircleUser, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";

export function UserDropdown() {
  const rootData = useIndexLoaderData();
  const signOutFetcher = useFetcher({ key: "signOut" });

  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <User />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <div>
            <span className="font-bold">Hello</span>
            <span className="block text-xs text-muted-foreground">
              {rootData.user?.email}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X />
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="h-14">
          <ShoppingBag />
          <span className="ml-6 text-base">My purchases</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="h-14" asChild>
          <Link to="/account">
            <CircleUser />
            <span className="ml-6 text-base">Personal details</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="h-14">
          <CircleAlert />
          <span className="ml-6 text-base">Privacy policy</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="p-3">
          <signOutFetcher.Form method="post" action="/resources/logout">
            <Button className="w-full h-full rounded-full font-bold text-lg">
              Sign out
            </Button>
          </signOutFetcher.Form>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
