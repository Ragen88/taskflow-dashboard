import { useEffect, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

// Default timeout: 30 minutes (in milliseconds)
const DEFAULT_TIMEOUT = 30 * 60 * 1000; // 30 minutes
// Warning shown 2 minutes before timeout
const WARNING_TIME = 2 * 60 * 1000; // 2 minutes

export function useSessionTimeout(timeoutMs = DEFAULT_TIMEOUT) {
  const { logout, isAuthenticated } = useAuth0();
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const warningStartTimeRef = useRef(null);

  const resetTimeout = () => {
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Reset warning state
    setShowWarning(false);
    setTimeRemaining(null);
    warningStartTimeRef.current = null;

    if (!isAuthenticated) return;

    // Calculate warning time (timeout - warning duration)
    const warningTime = timeoutMs - WARNING_TIME;

    // Set warning timeout
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      warningStartTimeRef.current = Date.now();
      setTimeRemaining(WARNING_TIME);
      
      // Update time remaining every second
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - warningStartTimeRef.current;
        const remaining = Math.max(0, WARNING_TIME - elapsed);
        setTimeRemaining(remaining);
        
        if (remaining === 0) {
          clearInterval(intervalRef.current);
        }
      }, 1000);
    }, warningTime);

    // Set logout timeout
    timeoutRef.current = setTimeout(() => {
      logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    }, timeoutMs);
  };

  const handleActivity = () => {
    resetTimeout();
  };

  useEffect(() => {
    if (!isAuthenticated) {
      // Clear timeouts when not authenticated
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setShowWarning(false);
      setTimeRemaining(null);
      return;
    }

    // Set up activity listeners
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Initialize timeout
    resetTimeout();

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, timeoutMs, logout]);

  return {
    showWarning,
    timeRemaining,
    resetTimeout,
  };
}
