import { redirect } from "solid-start"
import { state } from "./session"

const api = async (url: Parameters<typeof fetch>[0],options?: Parameters<typeof fetch>[1] & {request?: Request} ) => {  
  console.log(state)
  
  if (!state.instance) throw redirect('/login',{
    status: 401
  })
  
  if (!options) options = {}
  url = `https://${state.instance}/api/v1/${url}`
  options.headers = {
    "Authorization": `Bearer ${state.key}`
  }
  
  console.log(`fetching ${url}}`)

  try {
    let response = await fetch(url, options);
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
}

export default api;