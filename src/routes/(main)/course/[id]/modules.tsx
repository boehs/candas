import { For } from "solid-js"
import { RouteDataArgs, useRouteData } from "solid-start"
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


export default function Modules() {
    const { modules } = useRouteData<typeof routeData>()

    return <>
        <For each={modules()}>
            {module => <details>
                <summary>{module.name}</summary>
                <Table headers={['Title', 'Type']}>
                    <For each={module.items}>
                        {item => <Tr goal={() => undefined}>
                            <td style={{
                                "display": "inline-block",
                                "margin-left": `${item.indent * 30}px`
                            }}>{item.title}</td>
                            <td>{item.type}</td>
                        </Tr>}
                    </For>
                </Table>
            </details>}
        </For>
    </>
}