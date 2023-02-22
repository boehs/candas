import { useNavigate, useParams } from "@solidjs/router"
import { gql } from "@urql/core"
import { For, Show } from "solid-js"
import { A, createRouteData, RouteDataArgs, Title, useRouteData } from "solid-start"
import createFilteredView from "~/components/searchbar"
import Table, { TableContext } from "~/components/table"
import Tr from "~/components/tr"
import { client } from "~/lib/gql"
import { useCourse } from "~/routes/(main)"

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
    const assignmentsGroups = createRouteData<{
        node: {
            id: string
            name: string
            position: number
            assignmentsConnection: {
                edges: assignment
            }
        }
    }[], [number]>(async ([id]) => await client.query(gql`query($id: ID!) {
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
                      id: _id
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
        id: id
    }).toPromise().then(res => res.data.course.assignmentGroupsConnection.edges), {
        key: () => [Number(params.id)]
    })
    return { assignmentsGroups }
}

function AssignmentTable(props: {
    assignments: assignment
}) {
    const navigate = useNavigate()
    const params = useParams()
    const { findCourse } = useCourse()

    return <Table headers={['Name', 'Grade', 'Possible', '%', 'Due']}>
            <Title>Assignments for {findCourse(params.id).name}</Title>
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
                            {Math.round((Number(assignment.submissionsConnection.nodes[0].grade) / assignment.pointsPossible) * 100)}%
                        </Show>
                    </td>
                    <td>{(new Date(assignment.dueAt)).toLocaleDateString()}</td>
                </Tr>}
            </For>
        </Table>
}

export default function Assignments() {
    const { assignmentsGroups: unfilteredAssignmentsGroups } = useRouteData<typeof routeData>()
    
    const [Searchbar, assignmentsGroups] = createFilteredView(unfilteredAssignmentsGroups, (assignment, search) => {
        console.log(assignment)
		assignment.node.assignmentsConnection.edges = assignment.node.assignmentsConnection.edges.filter(item => item.node.name.includes(search()))
		return [assignment]
	}, 'assignments')
    
    return <TableContext>
        {Searchbar}
        <For each={assignmentsGroups()}>
            {group => <Show when={group.node.assignmentsConnection.edges.length > 0}>
                <details open>
                    <summary>{group.node.name}</summary>
                    <AssignmentTable assignments={group.node.assignmentsConnection.edges.sort((a, b) => new Date(b.node.dueAt).getTime() - new Date(a.node.dueAt).getTime())} />
                </details>
            </Show>}
        </For>
    </TableContext>
}
