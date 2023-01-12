import { createContextProvider } from "@solid-primitives/context";
import { createResource } from "solid-js";
import { createStore } from "solid-js/store";
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

export const [state,setState] = createStore<{
  instance: string
  key: string
}>({
  instance: '',
  key: ''
})

export const [StateProvider, useState] = createContextProvider(() => {
  console.log(state)
  
  const cookie = isServer
    ? useRequest().request.headers.get("cookie") ?? ""
    : document.cookie

  const [userSession] = createResource(async () => {
    if (state.instance && state.key) return
    const session = await storage.getSession(cookie)
    const tokens = {
      instance: session.data.instance as string || null,
      key: session.data.key as string || null
    }

    return (tokens)
  }, {
    deferStream: true
  })
  
  if (!userSession.loading) setState(userSession())
  
  return state
})