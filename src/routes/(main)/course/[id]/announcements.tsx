import { For } from "solid-js"
import { useParams, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import api from "~/lib/api"

export function routeData() {
    const annoucements = createServerData$(async () => await api(`announcements?context_codes[]=course_${useParams().id}`))
    return { annoucements }
}

export default function Announcements() {
    const { annoucements } = useRouteData<typeof routeData>()
    
    return <>
        <table>
            <tr>
                <th>Title</th>
                <th>Date</th>
            </tr>
            <For each={annoucements()}>
                {annoucement => <tr>
                    <td>{annoucement.title}</td>
                    <td>{(new Date(annoucement.posted_at)).toLocaleDateString()}</td>
                </tr>}
            </For>
        </table>
    </>
}