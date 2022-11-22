import { createEffect, Resource, Show } from "solid-js";
import { RouteDataArgs, Title, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import gclc from "~/lib/gql";
import { useCourse } from "~/routes/(main)";

export function routeData({ params }: RouteDataArgs) {
    const assignment: Resource<{
        description: string
        dueAt: string
        name: string
        htmlUrl: string
        submissionsConnection: {
            nodes: [{
                grade: string
                missing: string
            }]
        }
    }> = createServerData$(([assignment]) => gclc.query(`query($id: ID!){
        assignment(id: $id) {
          description
          dueAt
          name
          htmlUrl
          submissionsConnection {
            nodes {
              grade
              missing
            }
          }
        }
      }`, {
        id: assignment
    }).toPromise().then(res => res.data.assignment), {
        key: () => [params.assignment]
    })

    return assignment
}

export default function AssignmentView() {
    const {setCourses} = useCourse()
    const assignment = useRouteData<typeof routeData>()
    
    createEffect(() => { if (assignment()) setCourses({instUrl: assignment().htmlUrl}) })

    return <>
        <Show when={assignment()}>
            <Title>{assignment().name}</Title>
            <h1>{assignment().name}</h1>
            <ul>
                <li>due: {new Date(assignment().dueAt).toLocaleString()}</li>
            </ul>
            <hr/>
            <div innerHTML={assignment().description} />
        </Show>
    </>
}