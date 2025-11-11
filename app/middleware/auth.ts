import { redirect } from "react-router";

import { getSession } from "~/session";

export type AuthSession = {
  token: string;
  userId?: string;
  orgId?: string;
};

export type AuthSessionResult = AuthSession & {
  session: Awaited<ReturnType<typeof getSession>>;
};

export function safeRedirect(target: string | null | undefined, fallback = "/") {
  if (!target || typeof target !== "string") {
    return fallback;
  }

  if (!target.startsWith("/") || target.startsWith("//")) {
    return fallback;
  }

  return target;
}

export async function requireAuthSession(request: Request): Promise<AuthSessionResult> {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!token) {
    const url = new URL(request.url);
    const redirectTo = url.pathname + url.search;
    throw redirect(`/login?redirectTo=${encodeURIComponent(redirectTo || "/")}`);
  }

  return {
    session,
    token: token.toString(),
    userId: session.get("userId")?.toString(),
    orgId: session.get("orgId")?.toString(),
  };
}

export async function getOptionalAuthSession(
  request: Request,
): Promise<AuthSessionResult | null> {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!token) {
    return null;
  }

  return {
    session,
    token: token.toString(),
    userId: session.get("userId")?.toString(),
    orgId: session.get("orgId")?.toString(),
  };
}

