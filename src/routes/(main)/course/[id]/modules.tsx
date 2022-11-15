import { For, Match, Switch } from "solid-js"
import { RouteDataArgs, Title, useParams, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import Table from "~/components/table"
import Tr from "~/components/tr"
import api from "~/lib/api"

export function routeData({ params }: RouteDataArgs) {
    const modules = createServerData$(async ([id]) => await api(`courses/${id}/modules?include[]=items`), {
        key: () => [params.id]
    })
    return { modules }
}

function ResolveUrl(props: { item: {
    type: 'ExternalUrl' | 'ExternalTool'
    external_url: string
    title: string
    
} | {
    type: 'Assignment' | 'Discussion'
    content_id: number
    title: string
} | {
    type: string
    html_url: string
    title: string
}}) {
    const item = props.item
    
    // @ts-expect-error
    return <Switch fallback={<a href={item.html_url}>{item.title}</a>}>
        <Match when={['ExternalUrl', 'ExternalTool'].includes(item.type)}>
            {/*@ts-expect-error*/}
            <a href={item.external_url}>{item.title}</a>
        </Match>
        {/* This doesn't work because of gql ids vs legacy
        <Match when={'Assignment' == item.type }>
            {/*@ts-expect-error*/}{/*
            <a href={`assignments/${item.content_id}`}>{item.title}</a>
</Match>*/}
        <Match when={'Discussion' == item.type }>
            {/*@ts-expect-error*/}
            <a href={`/announcements/${item.content_id}`}>{item.title}</a>
        </Match>
    </Switch>
}



export default function Modules() {
    const { modules } = useRouteData<typeof routeData>()
    const params = useParams()

    return <>
        <Title>Modules: {params.id}</Title>
        <For each={modules()}>
            {module => <details open>
                <summary>{module.name}</summary>
                <Table headers={['Title', 'Type']}>
                    <For each={module.items}>
                        {item => <Tr goal={() => undefined}>
                            <td style={{
                                "display": "inline-block",
                                "margin-left": `${item.indent * 30}px`
                            }}><ResolveUrl item={item}/></td>
                            <td>{item.type}</td>
                        </Tr>}
                    </For>
                </Table>
            </details>}
        </For>
    </>
}