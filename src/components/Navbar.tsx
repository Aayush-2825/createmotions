"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { AuthDialog } from "./auth/AuthDialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "@/lib/auth-client";
import { DropdownMenuAvatar } from "./DropdownMenuAvatar";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function NavbarComponent() {
  const router = useRouter();
  const { data: session } = useSession();

  const navItems = [
    { name: "Project Files", link: "/project-files" },
    { name: "Inspiration", link: "/inspiration" },
    { name: "About Us", link: "/about" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Navbar className="w-full">
      {/* Desktop Navigation */}
      <NavBody className="hidden w-full items-center justify-between px-5 py-3 lg:flex">
        <div className="flex items-center gap-2">
          <NavbarLogo />
        </div>

        <NavItems
          items={navItems}
          className="text-white font-medium tracking-tight"
        />

        <div className="flex items-center gap-4">
          {!session?.user ? (
            <AuthDialog>
              <NavbarButton variant="primary" className="rounded-full px-6">
                Login
              </NavbarButton>
            </AuthDialog>
          ) : (
            <DropdownMenuAvatar isAdmin={session.user.role === "ADMIN"}>
              <Avatar className="ring-2 ring-primary/40 cursor-pointer transition hover:ring-primary/80">
                <AvatarImage src={session?.user?.image || undefined} />
                <AvatarFallback className="bg-primary/20 text-primary">
                  {session?.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuAvatar>
          )}
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader className="mx-1 px-4 py-3">
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <Link
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-white font-medium hover:bg-white/5 transition-colors"
            >
              {item.name}
            </Link>
          ))}

          <div className="mt-6 w-full pt-4 border-t border-white/10 px-4">
            {!session?.user ? (
              <NavbarButton
                onClick={() => router.push("/register")}
                variant="primary"
                className="w-full rounded-full"
              >
                Get Started
              </NavbarButton>
            ) : (
              <Button
                variant="secondary"
                className="w-full rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/dashboard");
                }}
              >
                Dashboard
              </Button>
            )}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
