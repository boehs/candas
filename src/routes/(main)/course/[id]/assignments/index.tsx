import { useNavigate, useParams } from "@solidjs/router"
import { For, Resource, Show } from "solid-js"
import { A, RouteDataArgs, Title, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import Table from "~/components/table"
import Tr from "~/components/tr"
import gclc from "~/lib/gql"

type assignment = {
    node: {
        id: string
        name: string
        pointsPossible: number
        dueAt: string
        submissionsConnection: {
            nodes?: [
                {
                    grade: string
                    missing: boolean
                }
            ]
        }
    }
}[]

export function routeData({ params }: RouteDataArgs) {
    const assignmentsGroups: Resource<{
        node: {
            id: string
            name: string
            position: number
            assignmentsConnection: {
                edges: assignment
            }
        }
    }[]> = createServerData$(async ([id]) => await gclc.query(`query($id: ID!) {
        course(id: $id) {
          assignmentGroupsConnection {
            edges {
              node {
                id
                name
                position
                assignmentsConnection {
                  edges {
                    node {
                      id
                      name
                      pointsPossible
                      dueAt
                      submissionsConnection {
                        nodes {
                          grade
                          missing
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }`, {
        id: Number(id)
    }).toPromise().then(res => res.data.course.assignmentGroupsConnection.edges), {
        key: () => [params.id]
    })
    return { assignmentsGroups }
}

function AssignmentTable(props: {
    assignments: assignment
}) {
    const navigate = useNavigate()
    const params = useParams()
    
    return <Table headers={['Name', 'Grade', 'Possible', '%', 'Due']}>
        <Title>Assignments: {params.id}</Title>
        <For each={props.assignments.map(ass => ass.node)}>
            {assignment => <Tr goal={() => navigate(`../assignments/${assignment.id}`)} style={{
                color: (() => {
                    if (assignment.submissionsConnection.nodes && assignment.submissionsConnection.nodes[0] && assignment.submissionsConnection.nodes && assignment.submissionsConnection.nodes[0].missing == true) return "red"
                    else if (new Date(assignment.dueAt).getTime() > new Date().getTime()) return "green"
                })()
            }}>
                <td><A href={`../assignments/${assignment.id}`}>{assignment.name}</A></td>
                <td>
                    <Show when={assignment.submissionsConnection.nodes && assignment.submissionsConnection.nodes[0]}>
                        {assignment.submissionsConnection.nodes[0].grade}
                    </Show>
                </td>
                <td>{assignment.pointsPossible}</td>
                <td>
                    <Show when={assignment.submissionsConnection.nodes && assignment.submissionsConnection.nodes[0]}>
                        {(Number(assignment.submissionsConnection.nodes[0].grade)/assignment.pointsPossible)*100}%
                    </Show>
                </td>
                <td>{(new Date(assignment.dueAt)).toLocaleDateString()}</td>
            </Tr>}
        </For>
    </Table>
}

export default function Assignments() {
    const { assignmentsGroups } = useRouteData<typeof routeData>()
    return <>
        <For each={assignmentsGroups()}>
            {group => <Show when={group.node.assignmentsConnection.edges.length > 0}>
                <details open>
                    <summary>{group.node.name}</summary>
                    <AssignmentTable assignments={group.node.assignmentsConnection.edges.sort((a, b) => new Date(b.node.dueAt).getTime() - new Date(a.node.dueAt).getTime())} />
                </details>
            </Show>}
        </For>
        {/*<AssignmentTable assignments={assignments()}/>*/}
    </>
}