import { Suspense } from "solid-js"
import { useParams, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import api from "~/lib/api"

export function routeData() {
    const wiki = createServerData$(async () => await api(`courses/${useParams().id}/front_page`))
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