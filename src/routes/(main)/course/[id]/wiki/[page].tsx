import { createEffect } from "solid-js"
import { RouteDataArgs, Title, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import api from "~/lib/api"
import { useCourse } from "~/routes/(main)"
import { AllPages } from "."

export function routeData({ params }: RouteDataArgs) {
    const wiki = createServerData$(async ([id,page],{request}) => await api(`courses/${id}/pages/${page}`,{request}), {
        key: () => [params.id,params.page]
    })
    const allPages = createServerData$(async ([id],{request}) => await api(`courses/${id}/pages/`,{request}), {
        key: () => [params.id]
    })
    return { wiki, allPages }
}

export default function Assignments() {
    const { wiki, allPages } = useRouteData<typeof routeData>()
    const { setCourses } = useCourse()
    
    createEffect(() => { if (wiki()) setCourses({instUrl: wiki().html_url}) })

    return <>
        <Title>Wiki: Main</Title>
        <AllPages wiki={wiki} allPages={allPages} prefix='../'/>
    </>
}