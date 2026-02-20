import { NavbarComponent } from "@/components/Navbar";
import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <div className="relative min-h-screen">
          <Toaster richColors position="top-right" />
          <div className="sticky h-20 z-20 ">
              <NavbarComponent />
            </div>
          <main className="relative z-10 ">{children}</main>
        </div>
      </body>
    </html>
  );
}
