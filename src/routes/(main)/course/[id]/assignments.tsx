import { createSignal, For } from "solid-js"
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
        <tr>
            <th>Name</th>
            <th>Possible</th>
            <th>Due</th>
        </tr>
        <For each={props.assignments.sort((a,b) => b.position - a.position)}>
            {assignment => <tr style={{
                color: (() => {
                    if (new Date(assignment.due_at).getTime() > new Date().getTime()) return "green"
                })()
            }}>
                <td>{assignment.name}</td>
                <td>{assignment.points_possible}</td>
                <td>{(new Date(assignment.due_at)).toLocaleDateString()}</td>
            </tr>}
        </For>
    </table>
}

export default function Assignments() {
    const { assignments, assignmentsGroups } = useRouteData<typeof routeData>()

    return <>
        <For each={assignmentsGroups()}>
            {(group, i) => <details open>
                <summary onClick={() => setOpen(i())}>{group.name}</summary>
                <AssignmentTable assignments={group.assignments}/>
            </details>}
        </For>
        {/*<AssignmentTable assignments={assignments()}/>*/}
    </>
}