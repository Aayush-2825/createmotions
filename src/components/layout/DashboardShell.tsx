"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const DashboardShell = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="flex flex-1 flex-col">
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
};
