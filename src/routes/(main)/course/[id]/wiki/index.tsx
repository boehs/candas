import { useNavigate } from "@solidjs/router"
import { For, Resource, Show, Suspense } from "solid-js"
import ErrorBoundary, { A, RouteDataArgs, Title, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import NoContent from "~/components/noContent"
import Table from "~/components/table"
import Tr from "~/components/tr"
import api from "~/lib/api"
import { useCourse } from "~/routes/(main)"
import wikiCss from './wiki.module.scss'

export function routeData({ params }: RouteDataArgs) {
    const wiki = createServerData$(async ([id]) => await api(`courses/${id}/front_page`), {
        key: () => [params.id]
    })
    const allPages = createServerData$(async ([id,page]) => await api(`courses/${id}/pages/`), {
        key: () => [params.id,params.page]
    })
    return { wiki, allPages }
}

export default function Wiki() {
    const { wiki, allPages } = useRouteData<typeof routeData>()
    const {setCourses} = useCourse()
    
    if (wiki()) setCourses({instUrl: wiki().html_url})

    return <>
        <Title>Wiki: Main</Title>
        <AllPages wiki={wiki} allPages={allPages} prefix=''/>
    </>
}

export function AllPages(props: {
    wiki: Resource<any>,
    allPages: Resource<any>
    prefix: string
}) {
    const navigate = useNavigate()
    return <>
        <Suspense>
            <Show when={props.wiki() && props.wiki().body} fallback={<NoContent />}>
                <div class={wikiCss.wiki} innerHTML={props.wiki() && props.wiki().body} />
            </Show>
        </Suspense>
        <ErrorBoundary>
            <Show when={props.allPages()}>
                <h2>Pages</h2>
                <Table headers={['Title']}>
                    <For each={props.allPages()}>
                        {page => <Tr goal={() => navigate(`${props.prefix}${page.page_id}`)}>
                            <td><A href={`${props.prefix}${page.page_id}`}>{page.title}</A></td>
                        </Tr>}
                    </For>
                </Table>
            </Show>
        </ErrorBoundary>
    </>
}