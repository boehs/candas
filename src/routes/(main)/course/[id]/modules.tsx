import { createSignal, For } from "solid-js"
import { useParams, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import api from "~/lib/api"

export function routeData() {
    const modules = createServerData$(async () => await api(`courses/${useParams().id}/modules?include[]=items`))
    return { modules }
}


export default function Modules() {
    const { modules } = useRouteData<typeof routeData>()

    return <>
        <For each={modules()}>
            {(module, i) => <details>
                <summary>{module.name}</summary>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        <For each={module.items}>
                            {item => <tr>
                                <td style={{
                                    "display": "inline-block",
                                    "margin-left": `${item.indent * 30}px`
                                }}>{item.title}</td>
                                <td>{item.type}</td>
                            </tr>}
                        </For>
                    </tbody>
                </table>
            </details>}

        </For>
    </>
}