import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth0 } from "@auth0/auth0-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { getUserProfile, saveUserProfile, clearUserProfile } from "@/utils/userStorage";

export default function Navbar() {
  const { logout, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  // Load profile data from localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      // Save Auth0 user data to localStorage if not already saved
      const storedProfile = getUserProfile();
      if (!storedProfile || storedProfile.sub !== user.sub) {
        saveUserProfile(user);
        setProfileData(user);
      } else {
        setProfileData(storedProfile);
      }
    }
  }, [user, isAuthenticated]);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-background shadow-md border-b border-border">
      <h1 className="text-2xl font-bold text-foreground">TaskFlow</h1>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="w-10 h-10 cursor-pointer">
              <AvatarImage src={profileData?.pictureDataUrl || profileData?.picture || user?.picture} alt={profileData?.name || user?.name} />
              <AvatarFallback>{(profileData?.name || user?.name)?.[0]}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuLabel className="flex flex-col">
              <span className="font-medium">{profileData?.name || user?.name}</span>
              {(profileData?.email || user?.email) && (
                <span className="text-xs text-muted-foreground">{profileData?.email || user?.email}</span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>TaskFlow</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                clearUserProfile();
                logout({ logoutParams: { returnTo: window.location.origin } });
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
