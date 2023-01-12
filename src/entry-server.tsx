import {
  createHandler,
  renderAsync,
  StartServer,
} from "solid-start/entry-server";

import { storage, setState, state } from '~/lib/session'

export default createHandler(
  ({forward}) => {
    return async event => {
      const store = await storage.getSession(event.request.headers.get('cookie'))
      setState(store.data)
      return forward(event)
    }
  },
  renderAsync((event) => <StartServer event={event} />)
);
