import { redirect } from "solid-start"
import { getSession } from "./session"

const api = async (url: Parameters<typeof fetch>[0],options?: Parameters<typeof fetch>[1] & {request?: Request} ) => {  
  const session = await getSession(options.request)
  if (!session.instance) throw redirect('/login',{
    status: 401
  })
  
  if (!options) options = {}
  url = `https://${session.instance}/api/v1/${url}`
  options.headers = {
    "Authorization": `Bearer ${session.key}`
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