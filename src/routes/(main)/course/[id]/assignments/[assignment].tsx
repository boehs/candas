import { createShortcut } from "@solid-primitives/keyboard";
import { Resource, Show } from "solid-js";
import { A, RouteDataArgs, Title, useNavigate, useParams, useRouteData } from "solid-start";
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
    const params = useParams()
    const navigate = useNavigate()
    const assignment = useRouteData<typeof routeData>()
    
    if (assignment()) setCourses({instUrl: assignment().htmlUrl})

    createShortcut(['b'], () => navigate('../'))
    return <>
        <span>
            <span class="secondary">b</span>
            <A end={true} href={`/course/${params.id}/assignments`}>Go back</A>
        </span>
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