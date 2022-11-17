import { Show, Suspense } from "solid-js"
import { RouteDataArgs, Title, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import api from "~/lib/api"
import wikiCss from './wiki.module.scss'

export function routeData({ params }: RouteDataArgs) {
    const wiki = createServerData$(async ([id]) => await api(`courses/${id}/front_page`), {
        key: () => [params.id]
    })
    return { wiki }
}

export default function Assignments() {
    const { wiki } = useRouteData<typeof routeData>()
    return <>
        <Title>Wiki: Main</Title>
        <Suspense>
            <Show when={wiki() && wiki().body} fallback={<div>
                <h1>Nothing here, but...</h1>
                <p>You're Breathtaking! 😼</p>
                <img src="https://media.tenor.com/hY5YVzpFgIkAAAAC/keanu-reeves-woah.gif" />
            </div>}>
                <div class={wikiCss.wiki} innerHTML={wiki() && wiki().body} />
            </Show>
        </Suspense>
    </>
}