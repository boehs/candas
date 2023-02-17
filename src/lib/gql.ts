import { AnyVariables, createClient } from '@urql/core'
import { createServerData$ } from 'solid-start/server'
import getSession from './session'

export default function query<T>(value: string, prams: AnyVariables, postprocess: ((r: Awaited<T>) => T) | false = false) {
  return createServerData$(async ({value,prams}, req) => {
    const state = await getSession(req.request.headers.get('cookie'))
    const client = createClient({
      url: `https://${state.instance}/api/graphql`,
      fetchOptions: () => {
        return {
          headers: {
             'Authorization': `Bearer ${state.key}`
          }
        }
      }
    })
    console.log(postprocess)
    const res = await (await client.query<T>(value,prams).toPromise()).data
    if (postprocess != false) return postprocess(res)
    else return res
  },{
    key: () => {return {value,prams}}
  })
}