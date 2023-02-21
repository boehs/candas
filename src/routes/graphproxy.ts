import { APIEvent, json, redirect } from "solid-start";
import getSession from "~/lib/session";

async function handler({request: req}: APIEvent) {
    const state = await getSession(req.headers.get('cookie'))
    
    if (!state.instance) throw redirect('/login')
    
    const body = JSON.stringify(await new Response(req.body).json())

    const proxied = await fetch(`https://${state.instance}/api/graphql`, {
        method: req.method,
        headers: {
            accept: "application/graphql+json, application/json",
            "accept-language": "en-US,en;q=0.9,la;q=0.8",
            "content-type": "application/json",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            Authorization: `Bearer ${state.key}`,
        },
        body: body,
        mode: "cors",
        credentials: "include",
        referrerPolicy: "strict-origin-when-cross-origin"
    })
    const res = JSON.parse(await proxied.text())
    console.log(proxied,res)
    return json(res)
}

export const GET = handler;
export const POST = handler;