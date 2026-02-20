import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord } from "react-icons/fa";
import { signIn } from "@/lib/auth-client";
import { useState } from "react";

export function AuthDialog({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Log in </DialogTitle>
          <DialogDescription>
            Please log in to access the dashboard and manage your projects.
          </DialogDescription>
        </DialogHeader>
        <Button
          variant="outline"
          disabled={loading}
          onClick={async () => {
            await signIn.social({
              provider: "google",
              callbackURL: "/dashboard",
              fetchOptions: {
                onRequest: () => {
                  setLoading(true);
                },
                onResponse: () => {
                  setLoading(false);
                },
              },
            });
          }}
        >
          <FcGoogle className="mr-2" />
          Log in with Google
        </Button>
        <Button
          variant="outline"
          disabled={loading}
          onClick={async () => {
            await signIn.social({
              provider: "discord",
              callbackURL: "/dashboard",
              fetchOptions: {
                onRequest: () => {
                  setLoading(true);
                },
                onResponse: () => {
                  setLoading(false);
                },
              },
            });
          }}
        >
          <FaDiscord className="mr-2" />
          Log in with Discord
        </Button>
      </DialogContent>
    </Dialog>
  );
}
