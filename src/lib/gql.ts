import { createClient } from '@urql/core'
import * as dotenv from 'dotenv'

dotenv.config({
  path: '../../.env'
})

const endpoint = process.env.ENDPOINT || 'brookline.instructure.com'

const gclc = createClient({
  url: `https://${endpoint}/api/graphql`,
  fetchOptions: () => {
    return {
      headers: {
         'Authorization': `Bearer ${process.env.AUTH}`
      }
    }
  }
})

export default gclc