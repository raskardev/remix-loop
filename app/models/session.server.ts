import { createCookieSessionStorage, redirect } from "@remix-run/node";

if (!process.env.AUTH_SECRET) {
  throw new Error("Missing AUTH_SECRET environment variable");
}

const { getSession, commitSession } = createCookieSessionStorage({
  cookie: {
    name: "RMX_SESSION",
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
