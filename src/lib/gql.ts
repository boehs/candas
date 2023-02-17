import { createClient } from '@urql/core'

const gclc = () => createClient({
  url: `https://${state.instance}/api/graphql`,
  fetchOptions: () => {
    return {
      headers: {
         'Authorization': `Bearer ${state.key}`
      }
    }
  }
})

export default gclc