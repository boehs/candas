import { A, useNavigate } from "@solidjs/router"
import { For, Show } from "solid-js"
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

type urls = {
    item: {
        type: 'ExternalUrl' | 'ExternalTool'
        external_url: string
        title: string

    } | {
        type: 'Assignment' | 'Discussion'
        content_id: number
        title: string
    }
}

function resolveUrl(props: urls) {
    if (!props.item) return ''
    switch (props.item.type) {
        case 'ExternalTool' || 'ExternalUrl': return props.item.external_url
        // This doesn't work because of gql ids vs legacy
        // case 'Assignment': return `assignments/${props.item.content_id}`
        case 'Discussion': return `announcements/${props.item.content_id}`
        // @ts-expect-error
        default: return props.item.html_url
    }
}

function ResolveUrl(props: urls) {
    return <Show when={['Discussion'/*,'Assignment'*/].includes(props.item.type)} fallback={
        <a href={resolveUrl(props)}>{props.item.title}</a>
    }>
        <A href={resolveUrl(props)}>{props.item.title}</A>
    </Show>
}



export default function Modules() {
    const { modules } = useRouteData<typeof routeData>()
    const navigate = useNavigate()
    const navigateShim = (location: string) => {
        try {
            navigate(location)
        } catch {
            window.location.replace(location)
        }
    }
    const params = useParams()

    return <>
        <Title>Modules: {params.id}</Title>
        <For each={modules()}>
            {module => <details open={module.state != 'completed'}>
                <summary>{module.name}</summary>
                <Table headers={['Title', 'Type']}>
                    <For each={module.items}>
                        {item => <Tr goal={() => navigateShim(resolveUrl({
                            // @ts-expect-error
                                item: item
                            }))}>
                            <td style={{
                                "display": "inline-block",
                                "margin-left": `${item.indent * 30}px`
                            }}><ResolveUrl item={item} /></td>
                            <td>{item.type}</td>
                        </Tr>}
                    </For>
                </Table>
            </details>}
        </For>
    </>
}