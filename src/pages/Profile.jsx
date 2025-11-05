import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";

export default function Profile() {
  const { user, loginWithRedirect } = useAuth0();

  const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const accountUrl = `https://${auth0Domain}/u/account`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="max-w-2xl w-full mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Your Profile</h1>

        <div className="flex items-start gap-6 bg-card text-card-foreground border border-border rounded-xl p-6">
          <img
            src={user.picture}
            alt={user.name}
            className="w-24 h-24 rounded-full border border-border object-cover"
          />

          <div className="flex-1 space-y-2">
            <div>
              <div className="text-sm text-muted-foreground">Name</div>
              <div className="text-lg font-medium">{user.name}</div>
            </div>

            {user.email && (
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="text-lg">{user.email}</div>
              </div>
            )}

            <div>
              <div className="text-sm text-muted-foreground">User ID</div>
              <div className="text-xs break-all">{user.sub}</div>
            </div>

            {user.nickname && (
              <div>
                <div className="text-sm text-muted-foreground">Nickname</div>
                <div className="text-lg">{user.nickname}</div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            variant="default"
            onClick={() => window.open(accountUrl, "_blank")}
          >
            Edit profile in Auth0
          </Button>

          <Button
            variant="outline"
            onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: "reset_password" } })}
          >
            Change password
          </Button>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          If Edit profile opens a Not found page, enable Auth0 Account settings in your tenant. Password changes use Auth0’s secure reset flow.
        </p>
      </div>
    </div>
  );
}


