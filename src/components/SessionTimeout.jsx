import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";

export default function SessionTimeout() {
  const { showWarning, timeRemaining, resetTimeout } = useSessionTimeout();
  const { logout } = useAuth0();

  if (!showWarning) return null;

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-2 text-foreground">
          Session Timeout Warning
        </h2>
        <p className="text-muted-foreground mb-4">
          Your session will expire in{" "}
          <span className="font-semibold text-foreground">
            {formatTime(timeRemaining)}
          </span>
          . Click "Stay Logged In" to continue your session.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={handleLogout}>
            Logout Now
          </Button>
          <Button onClick={resetTimeout}>Stay Logged In</Button>
        </div>
      </div>
    </div>
  );
}
