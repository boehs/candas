import { createContextProvider } from "@solid-primitives/context";
import { createResource } from "solid-js";
import { isServer } from "solid-js/web";
import { createCookieSessionStorage } from "solid-start";
import { useRequest } from "solid-start/server";

export const storage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secure: import.meta.env.PROD,
    //secrets: [import.meta.env.VITE_SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true
  }
});

export default async function getSession(cookie: string) {
    const session = await storage.getSession(cookie)
    return {
      instance: session.data.instance as string || null,
      key: session.data.key as string || null
    }
}