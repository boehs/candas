import { isServer } from "solid-js/web";
import { createCookieSessionStorage, useServerContext } from "solid-start";

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

export async function getSession(req?: Request) {
    const event = req || useServerContext().request;
    const cookie =
      isServer 
      ? event.headers.get("cookie") ?? ""
      : document.cookie
    const session = await storage.getSession(cookie)
    return {
      instance: session.get('instance'),
      key: session.get('key')
    }
}