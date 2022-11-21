import { A, useNavigate } from "@solidjs/router"
import { For, Match, Resource, Show, Switch } from "solid-js"
import { RouteDataArgs, Title, useParams, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import Table from "~/components/table"
import Tr from "~/components/tr"
import api from "~/lib/api"
import { camelToTitle } from "~/lib/helpers"

type Module = {
    id: number
    title: string
    position: number
    indent: number
    type: string
    external_url: string
    content_id: number
}

type ModuleList = {
    name: string
    position: number
    items: Module[]
}[]

export function routeData({ params }: RouteDataArgs) {
    const modules: Resource<ModuleList> = createServerData$(async ([id]) => await api(`courses/${id}/modules?include[]=items`).then((moduleList: ModuleList) => {
        moduleList.map(module => {
            module.items = module.items.map(item => {
                if (item.content_id) item.id = item.content_id
                return item
            })
        })
        return moduleList
    }), {
        key: () => [params.id]
    })
    return { modules }
}

const maps = {
    internal: {
        'Assignment': 'assignments',
        'Discussion': 'announcements',
        'Page': 'wiki'
    },
    external: {
        'Quiz': (mod: Module, course: any) => `https://${process.env.ENDPOINT}/courses/${course}/quizzes/${mod.id}`
    }
}

function resolveUrl(mod: Module, course: any): ['A' | 'a', string] | null {
    if (mod.id && maps.internal[mod.type])
        return ['A', `../${maps.internal[mod.type]}/${mod.id}`]
    if (maps.external[mod.type])
        return ['a', maps.external[mod.type](mod, course)]
    if (mod.external_url)
        return ['a', mod.external_url]
    return null
}

function ResolveUrl(props: {
    item: Module
    course: any
}) {
    const resolved = resolveUrl(props.item, props.course)
    return <Switch>
        <Match when={!resolved}>
            {props.item.title}
        </Match>
        <Match when={resolved[0] == 'A'}>
            <A href={resolved[1]}>{props.item.title}</A>
        </Match>
        <Match when={resolved[0] == 'a'}>
            <i><a href={resolved[1]}>{props.item.title}</a></i>
        </Match>
    </Switch>
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
            {module => <details open>
                <summary>{module.name}</summary>
                <Table headers={['Title', 'Type']}>
                    <For each={module.items}>
                        {item => <Tr goal={() => navigateShim(resolveUrl(item, params.id)[1])}>
                            <td style={{
                                "display": "inline-block",
                                "margin-left": `${item.indent * 30}px`
                            }}>
                                <Show when={item.type == 'SubHeader'} fallback={
                                    <ResolveUrl item={item} course={params.id} />
                                }>
                                    <h3><ResolveUrl item={item} course={params.id} /></h3>
                                </Show>
                            </td>
                            <td>{camelToTitle(item.type)}</td>
                        </Tr>}
                    </For>
                </Table>
            </details>}
        </For>
    </>
}