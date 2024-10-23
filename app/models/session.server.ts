import { createCookieSessionStorage, redirect } from "@remix-run/node";

if (!process.env.AUTH_SECRET) {
  throw new Error("Missing AUTH_SECRET environment variable");
}

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "session",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      secrets: [process.env.AUTH_SECRET],
      path: "/",
      maxAge: 60 * 60 * 24 * 1000,
    },
  });

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await getSession();

  session.set("userId", userId);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const getUserId = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));

  return session.get("userId");
};

export async function requireUserId(
  request: Request,
  { redirectTo }: { redirectTo?: string | null } = {},
) {
  const userId = await getUserId(request);

  if (!userId) {
    const requestUrl = new URL(request.url);
    redirectTo =
      redirectTo === null
        ? null
        : (redirectTo ?? `${requestUrl.pathname}${requestUrl.search}`);

    const loginParams = redirectTo ? new URLSearchParams({ redirectTo }) : null;
    const loginRedirect = ["/login", loginParams?.toString()]
      .filter(Boolean)
      .join("?");

    throw redirect(loginRedirect);
  }

  return userId;
}
