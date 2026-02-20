import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCookieCache } from "better-auth/cookies";

const publicPages = [
  "/",
  "/project-files",
  "/inspiration",
  "/resources",
  "/about",
  "/unauthorized",
];

const authPages = ["/sign-in", "/register"];
const adminPages = ["/admin"];

const matchRoute = (pathname: string, routes: string[]) =>
  routes.includes(pathname) ||
  routes.some((route) => pathname.startsWith(`${route}/`));

export async function proxy(request: NextRequest) {
  const session = await getCookieCache(request);
  const { pathname } = request.nextUrl;

  const isPublicPage = matchRoute(pathname, publicPages);
  const isAuthPage = authPages.includes(pathname);
  const isAdminRoute = matchRoute(pathname, adminPages);

  // Redirect logged-in users away from auth pages
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow public pages
  if (isPublicPage || isAuthPage) {
    return NextResponse.next();
  }

  // Protect private routes
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Protect admin routes
  if (isAdminRoute && session.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
