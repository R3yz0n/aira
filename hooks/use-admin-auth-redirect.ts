"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminAuthApi } from "@/lib/api/admin-auth";

/**
 * Custom hook to handle admin authentication redirects.
 *
 * @param options -
 *   - redirectIfAuthenticated: if true, redirect to target if already logged in (e.g., on login page)
 *   - redirectIfUnauthenticated: if true, redirect to target if not logged in (e.g., on protected page)
 *   - redirectTo: path to redirect to (default: "/admin" or "/login" based on context)
 *   - useWindowReplace: use window.location.replace instead of router.replace
 * @returns checking: boolean (true while checking auth status)
 */
export function useAdminAuthRedirect({
  redirectIfAuthenticated = false,
  redirectIfUnauthenticated = false,
  redirectTo,
  useWindowReplace = false,
}: {
  redirectIfAuthenticated?: boolean;
  redirectIfUnauthenticated?: boolean;
  redirectTo?: string;
  useWindowReplace?: boolean;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = adminAuthApi.getToken();
    const isLoggedIn = token && !adminAuthApi.isTokenExpired(token);

    if (redirectIfAuthenticated && isLoggedIn) {
      const target = redirectTo || "/admin";
      if (useWindowReplace) {
        window.location.replace(target);
      } else {
        router.replace(target);
      }
      return;
    }
    if (redirectIfUnauthenticated && !isLoggedIn) {
      adminAuthApi.removeToken();
      const target = redirectTo || "/login";
      if (useWindowReplace) {
        window.location.replace(target);
      } else {
        router.replace(target);
      }
      return;
    }
    setChecking(false);
  }, [router, redirectIfAuthenticated, redirectIfUnauthenticated, redirectTo, useWindowReplace]);

  return { checking };
}
