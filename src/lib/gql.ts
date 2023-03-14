import { createClient } from '@urql/core'
import { isServer } from "solid-js/web"
import server$, { useRequest } from 'solid-start/server'

export const client = createClient({
  url: `/graphproxy`,
  fetchOptions: () => {
    return isServer ? {
      headers: {
        cookie: useRequest().request.headers.get('cookie')
      }
    } : {}
  },
  fetch: server$.fetch,
  requestPolicy: isServer ? 'network-only' : 'cache-and-network'
})