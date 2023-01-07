import { createContextProvider } from "@solid-primitives/context";
import { createResource } from "solid-js";
import { isServer } from "solid-js/web";
import { createCookieSessionStorage } from "solid-start";
import { useRequest } from "solid-start/server";

export const storage = createCookieSessionStorage({
  cookie: {
    name: "session",
    //secure: import.meta.env.PROD,
    //secrets: [import.meta.env.VITE_SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    //httpOnly: true
  }
});

export async function getSession(cookie?: string) {
  cookie = isServer
      ? useRequest().request.headers.get("cookie") ?? ""
      : document.cookie
  const session = await storage.getSession(cookie)
  console.log(session.get('key'), session.get('instance'))
  return {
    instance: session.get('instance') as string || null,
    key: session.get('key') as string || null
  }
}

const [initalUser] = createResource(async () => await getSession())

export const [State,useState] = createContextProvider(() => initalUser)