"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function DangerZone() {
  async function deleteAccount() {
    const confirmDelete = confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    await authClient.deleteUser();
  }

  return (
    <Card className="border-red-300">
      <CardHeader>
        <CardTitle className="text-red-600">
          Danger Zone
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Button variant="destructive" onClick={deleteAccount}>
          Delete Account
        </Button>
      </CardContent>
    </Card>
  );
}
