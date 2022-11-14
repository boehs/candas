import { Suspense } from "solid-js"
import { RouteDataArgs, useParams, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import api from "~/lib/api"

export function routeData({params}: RouteDataArgs) {
    const wiki = createServerData$(async ([id]) => await api(`courses/${id}/front_page`),{
        key: () => [params.id]
    })
    return { wiki }
}

export default function Assignments() {    
    const {wiki} = useRouteData<typeof routeData>()
    
    return <>
        <Suspense>
            <div innerHTML={(wiki() || {body: ""}).body}/>
        </Suspense>
    </>
}