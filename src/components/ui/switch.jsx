// src/components/ui/switch.jsx
import * as React from "react";
import { forwardRef } from "react";

const Switch = forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
        className="sr-only"
        ref={ref}
        {...props}
      />
      <div className="w-11 h-6 bg-muted rounded-full peer-checked:bg-primary relative transition-colors">
        <span className="absolute left-1 top-1 w-4 h-4 bg-background rounded-full transition-transform peer-checked:translate-x-5"></span>
      </div>
    </label>
  );
});

Switch.displayName = "Switch";
export { Switch };
