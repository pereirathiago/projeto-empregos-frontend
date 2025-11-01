import { jwtDecode } from "jwt-decode";
import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

interface JwtPayload {
  sub: string;
  username: string;
  role: "user" | "company";
  exp: number;
}

const publicRoutes = [
  { path: "/sign-in", whenAuthenticated: "redirect" },
  { path: "/sign-in/user", whenAuthenticated: "redirect" },
  { path: "/sign-in/company", whenAuthenticated: "redirect" },
  { path: "/register", whenAuthenticated: "redirect" },
  { path: "/register/user", whenAuthenticated: "redirect" },
  { path: "/register/company", whenAuthenticated: "redirect" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/sign-in";

function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
}

function getRoleFromToken(token: string): "user" | "company" | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.role;
  } catch (error) {
    console.error("Error decoding token for role:", error);
    return null;
  }
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === path);
  const authTokenCookie = request.cookies.get("token");
  const authToken = authTokenCookie?.value;

  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  if (authToken) {
    const expired = isTokenExpired(authToken);

    if (expired) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;

      const response = NextResponse.redirect(redirectUrl);
      response.cookies.delete("token");

      return response;
    }

    if (publicRoute && publicRoute.whenAuthenticated === "redirect") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }

    const role = getRoleFromToken(authToken);
    if (role) {
      const response = NextResponse.next();
      response.headers.set("x-user-role", role);
      return response;
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
