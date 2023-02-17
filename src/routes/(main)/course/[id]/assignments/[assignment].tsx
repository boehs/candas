import { gql } from "@urql/core";
import { createEffect, Show } from "solid-js";
import { createRouteData, RouteDataArgs, Title, useRouteData } from "solid-start";
import query, { client } from "~/lib/gql";
import { useCourse } from "~/routes/(main)";

export function routeData({ params }: RouteDataArgs) {
    const assignment = createRouteData<{
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
    },[string]>(([assignment]) => client.query(gql`query($id: ID!){
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
    const { setCourses } = useCourse()
    const assignment = useRouteData<typeof routeData>()

    createEffect(() => { if (assignment()) setCourses({ instUrl: assignment().htmlUrl }) })

    return <>
        <Show when={assignment()}>
            <Title>{assignment().name}</Title>
            <h1>{assignment().name}</h1>
            <ul>
                <li>due: {new Date(assignment().dueAt).toLocaleString()}</li>
            </ul>
            <hr />
            <div innerHTML={assignment().description} />
        </Show>
    </>
}