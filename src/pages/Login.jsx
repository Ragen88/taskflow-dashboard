import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../components/ui/button";

export default function Login() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">TaskFlow</h1>
      {!isAuthenticated ? (
        <Button onClick={() => loginWithRedirect()}>Login with Auth0</Button>
      ) : (
        <div className="flex flex-col items-center">
          <p className="mb-4">Welcome, {user.name} 👋</p>
          <Button
            variant="destructive"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}
