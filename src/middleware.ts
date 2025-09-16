import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import {
  isBypassRoutes,
  isProtectedMatcher,
  isPublicRoutes,
} from "./lib/permissions";

const BypassMatcher = createRouteMatcher(isBypassRoutes);
const PublicMatcher = createRouteMatcher(isPublicRoutes);
const ProtectedMatcher = createRouteMatcher(isProtectedMatcher);

export default convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    // Bypass middleware
    if (BypassMatcher(request)) return;
    const authed = await convexAuth.isAuthenticated();
    // Public middleware
    if (PublicMatcher(request) && authed) {
      return nextjsMiddlewareRedirect(request, "/dashboard");
    }
    // Protected middleware
    if (ProtectedMatcher(request) && !authed) {
      return nextjsMiddlewareRedirect(request, "/auth/sign-in");
    }
    return;
  },
  {
    cookieConfig: {
      maxAge: 60 * 60 * 24 * 30,
    },
  }
);

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
