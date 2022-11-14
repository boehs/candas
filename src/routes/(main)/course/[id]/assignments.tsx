import { createSignal, For, Show } from "solid-js"
import { useParams, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import api from "~/lib/api"

export function routeData() {
    const assignments = "createServerData$(async () => await api(`courses/${useParams().id}/assignments`))"
    const assignmentsGroups = createServerData$(async () => await api(`courses/${useParams().id}/assignment_groups?include[]=assignments`))
    return { assignments, assignmentsGroups }
}

function AssignmentTable(props: {
    assignments: [{
        due_at: string,
        name: string,
        points_possible: number,
        position: number
    }]
}) {
    return <table>
    </table>
}

export default function Assignments() {
    const { assignments, assignmentsGroups } = useRouteData<typeof routeData>()

    return <>
        <For each={assignmentsGroups()}>
            {(group, i) => <Show when={group.assignments.length > 0}>
                <details open>
                    <summary onClick={() => setOpen(i())}>{group.name}</summary>
                    <AssignmentTable assignments={group.assignments} />
                </details>
            </Show>}
        </For>
        {/*<AssignmentTable assignments={assignments()}/>*/}
    </>
}