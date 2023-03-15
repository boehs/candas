import { Resource } from "solid-js"
import { redirect } from "solid-start"
import { createServerData$ } from "solid-start/server"
import getSession from "./session"

const api = <T>(endpoint: () => Parameters<typeof fetch>[0], options: (Parameters<typeof fetch>[1]) & {
  postprocess?: (r: ReturnType<JSON["parse"]>) => T
} = {}) => {
  return createServerData$(async ([url,options], req) => {
    const state = await getSession(req.request.headers.get('cookie'))

    if (!state.instance) throw redirect('/login')
    url = `https://${state.instance}/api/v1/${url}`

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
        const json = JSON.parse(text);
        if (options.postprocess) return options.postprocess(json)
        else return json
      } catch (e) {
        console.error(e);
        return { error: e };
      }
    } catch (error) {
      console.log(error)
      return { error };
    }
  }, {
    key: () => [endpoint(),options] as const
  }) as Resource<T>
}

export default api;