import { useNavigate } from "@solidjs/router"
import { createEffect, For, Resource, Show, Suspense } from "solid-js"
import ErrorBoundary, { A, RouteDataArgs, Title, useRouteData } from "solid-start"
import NoContent from "~/components/noContent"
import Table from "~/components/table"
import Tr from "~/components/tr"
import api from "~/lib/api"
import { useCourse } from "~/routes/(main)"
import wikiCss from './wiki.module.scss'

export function routeData({ params }: RouteDataArgs) {
    const wiki = api(`courses/${params.id}/front_page`)
    const allPages = api(`courses/${params.id}/pages/`)
    return { wiki, allPages }
}

export default function Wiki() {
    const { wiki, allPages } = useRouteData<typeof routeData>()
    const {setCourses} = useCourse()
    
    createEffect(() => { if (wiki()) setCourses({instUrl: wiki().html_url}) })

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