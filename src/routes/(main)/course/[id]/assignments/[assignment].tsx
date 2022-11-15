import { createShortcut } from "@solid-primitives/keyboard";
import { Resource, Suspense } from "solid-js";
import { A, RouteDataArgs, useNavigate, useParams, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import gclc from "~/lib/gql";

export function routeData({ params }: RouteDataArgs) {
    const assignment: Resource<{
        description: string
        dueAt: string
        name: string
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
          submissionsConnection {
            nodes {
              grade
              missing
            }
          }
        }
      }
    `, {
        id: assignment
    }).toPromise().then(res => res.data.assignment), {
        key: () => [params.assignment]
    })

    return assignment
}

export default function AnnoucementView() {
    const params = useParams()
    const navigate = useNavigate()
    const assignment = useRouteData<typeof routeData>()

    createShortcut(['b'], () => navigate('../'))
    return <>
        <span>
            <span class="secondary">b</span>
            <A end={true} href={`/course/${params.id}/assignments`}>Go back</A>
        </span>
        <Suspense>
            <h1>{assignment().name}</h1>
            <ul>
                <li>due: {new Date(assignment().dueAt).toLocaleString()}</li>
            </ul>
            <div innerHTML={assignment().description} />
        </Suspense>
    </>
}