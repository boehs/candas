import { createClient } from '@urql/core'
import server$ from 'solid-start/server'

export const client = createClient({
  url: `/graphproxy`,
  fetch: server$.fetch
})