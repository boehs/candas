import { APIEvent, json } from "solid-start";
import getSession from "~/lib/session";

async function handler({request: req}: APIEvent) {
    const state = await getSession(req.headers.get('cookie'))
    
    const body = JSON.stringify(await new Response(req.body).json())
    console.log(body)

    const proxied = await fetch(`https://${state.instance}/api/graphql`, {
        method: req.method,
        headers: {
            "accept": "application/graphql+json, application/json",
            "accept-language": "en-US,en;q=0.9,la;q=0.8",
            "content-type": "application/json",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "Authorization": `Bearer ${state.key}`,
        },
        body: body,
        mode: "cors",
        credentials: "include",
        referrerPolicy: "strict-origin-when-cross-origin"
    })
    const res = JSON.parse(await proxied.text())
    return json(res)
}

export const GET = handler;
export const POST = handler;