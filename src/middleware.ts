export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/editor/:path*", "/api/projects/:path*"],
};
