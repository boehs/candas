import { redirect } from "solid-start"
import { createServerData$ } from "solid-start/server"
import getSession from "./session"

const api = (url: Parameters<typeof fetch>[0], options?: Parameters<typeof fetch>[1]) => {
  return createServerData$(async (url, req) => {
    const state = await getSession(req.request.headers.get('cookie'))

    if (!state.instance) throw redirect('/login', {
      status: 401
    })
    url = `https://${state.instance}/api/v1/${url}`

    console.log(`fetching ${url}}`)

    try {
      let response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${state.key}`
        }
      });
      let text = await response.text();
      try {
        if (text === null) {
          return { error: "Not found" };
        }
        return JSON.parse(text);
      } catch (e) {
        console.error(e);
        return { error: e };
      }
    } catch (error) {
      return { error };
    }
  }, {
    key: () => url
  })
}

export default api;