import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isProtectedRoute(req)) {
    return;
  }

  await auth.protect();

  const { userId } = await auth();

  if (!userId) {
    return;
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role =
    typeof user.publicMetadata?.role === "string"
      ? user.publicMetadata.role.toLowerCase()
      : undefined;

  if (role !== "admin") {
    return Response.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
