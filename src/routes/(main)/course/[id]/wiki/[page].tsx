import { RouteDataArgs, Title, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import api from "~/lib/api"
import { AllPages } from "."

export function routeData({ params }: RouteDataArgs) {
    const wiki = createServerData$(async ([id,page]) => await api(`courses/${id}/pages/${page}`), {
        key: () => [params.id,params.page]
    })
    const allPages = createServerData$(async ([id,page]) => await api(`courses/${id}/pages/`), {
        key: () => [params.id,params.page]
    })
    return { wiki, allPages }
}

export default function Assignments() {
    const { wiki, allPages } = useRouteData<typeof routeData>()
    console.log(allPages())
    return <>
        <Title>Wiki: Main</Title>
        <AllPages wiki={wiki} allPages={allPages} prefix='../'/>
    </>
}