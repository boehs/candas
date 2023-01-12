import { createClient } from '@urql/core'
import { useState } from './session'

const gclc = () => createClient({
  url: `https://${useState().instance}/api/graphql`,
  fetchOptions: () => {
    return {
      headers: {
         'Authorization': `Bearer ${useState().key}`
      }
    }
  }
})

export default gclc