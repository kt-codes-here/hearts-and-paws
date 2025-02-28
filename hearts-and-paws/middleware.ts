import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();
export const config = {
  matcher: "/((?!_next|.*\\..*).*)", // Apply Clerk auth to all pages except static assets
};
