import { createClient } from '@urql/core'
import * as dotenv from 'dotenv'
import { useState } from './session'

dotenv.config({
  path: '../../.env'
})

const gclc = createClient({
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