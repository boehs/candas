import { A, useNavigate } from "@solidjs/router"
import { For, Show, Suspense } from "solid-js"
import { ErrorBoundary, RouteDataArgs, Title, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import NoContent from "~/components/noContent"
import Table from "~/components/table"
import Tr from "~/components/tr"
import api from "~/lib/api"
import wikiCss from './wiki.module.scss'

export function routeData({ params }: RouteDataArgs) {
    const wiki = createServerData$(async ([id,page]) => await api(`courses/${id}/pages/${page}`), {
        key: () => [params.id,params.page]
    })
    const allPages = createServerData$(async ([id,page]) => await api(`courses/${id}/pages/`), {
        key: () => [params.id,params.page]
    })
    return { wiki, allPages }
}

export default function Assignments() {
    const { wiki, allPages } = useRouteData<typeof routeData>()
    const navigate = useNavigate()
    console.log(allPages())
    return <>
        <Title>Wiki: Main</Title>
        <Suspense>
            <Show when={wiki() && wiki().body} fallback={<NoContent/>}>
                <div class={wikiCss.wiki} innerHTML={wiki() && wiki().body} />
            </Show>
        </Suspense>
        <ErrorBoundary>
            <Show when={allPages()} fallback={<NoContent/>}>
                <h2>Pages</h2>
                <Table headers={['Title']}>
                    <For each={allPages()}>
                        {page => <Tr goal={() => navigate(`../${page.page_id}`)}>
                            <td><A href={`../${page.page_id}`}>{page.title}</A></td>
                        </Tr>}
                    </For>
                </Table>
            </Show>
        </ErrorBoundary>
    </>
}