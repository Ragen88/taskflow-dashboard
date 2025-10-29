import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth0 } from "@auth0/auth0-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { logout, user } = useAuth0();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-background shadow-md border-b border-border">
      <h1 className="text-2xl font-bold text-foreground">TaskFlow</h1>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="w-10 h-10 cursor-pointer">
              <AvatarImage src={user.picture} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>{user.name}</DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
