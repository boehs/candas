import { For, Resource, Show } from "solid-js"
import { RouteDataArgs, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import Table from "~/components/table"
import Tr from "~/components/tr"
import api from "~/lib/api"

type assignment = [{
    due_at: string,
    name: string,
    points_possible: number,
    position: number
}]

export function routeData({ params }: RouteDataArgs) {
    const assignments = "createServerData$(async () => await api(`courses/${useParams().id}/assignments`))"
    const assignmentsGroups: Resource<[{
        name: string,
        assignments: assignment
    }]> = createServerData$(async ([id]) => await api(`courses/${id}/assignment_groups?include[]=assignments`), {
        key: () => [params.id]
    })
    return { assignments, assignmentsGroups }
}

function AssignmentTable(props: {
    assignments: assignment
}) {
    return <Table headers={['Name', 'Possible', 'Due']}>
        <For each={props.assignments}>
            {assignment => <Tr goal={() => undefined} style={{
                color: (() => {
                    if (new Date(assignment.due_at).getTime() > new Date().getTime()) return "green"
                })()
            }}>
                <td>{assignment.name}</td>
                <td>{assignment.points_possible}</td>
                <td>{(new Date(assignment.due_at)).toLocaleDateString()}</td>
            </Tr>}
        </For>
    </Table>
}

export default function Assignments() {
    const { assignmentsGroups } = useRouteData<typeof routeData>()

    return <>
        <For each={assignmentsGroups()}>
            {group => <Show when={group.assignments.length > 0}>
                <details open>
                    <summary>{group.name}</summary>
                    <AssignmentTable assignments={group.assignments.sort((a, b) => new Date(b.due_at).getTime() - new Date(a.due_at).getTime())} />
                </details>
            </Show>}
        </For>
        {/*<AssignmentTable assignments={assignments()}/>*/}
    </>
}