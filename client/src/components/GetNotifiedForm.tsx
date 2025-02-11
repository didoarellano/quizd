import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export function GetNotifiedForm({ className }: { className?: string }) {
  return (
    <form
      aria-label="Signup for launch notifications"
      className={className}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex gap-2">
        <label htmlFor="email-input" className="sr-only">
          Email address
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          id="email-input"
          required
          aria-describedby="notification-description"
          className="p-2 border border-input bg-slate-50 text-black placeholder:text-teal-600 rounded-sm"
        />
        <Button
          type="submit"
          aria-label="Submit email address for launch notifications"
          className="p-4 flex items-center bg-teal-900 hover:bg-teal-800 text-slate-50 whitespace-nowrap"
          size="lg"
        >
          Get Notified
          <Send aria-hidden="true" />
        </Button>
      </div>
      <p id="notification-description" className="text-slate-200 text-sm">
        Be the first to know when we launch.
      </p>
    </form>
  );
}
