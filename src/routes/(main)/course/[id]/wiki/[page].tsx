import { createEffect } from "solid-js"
import { RouteDataArgs, Title, useRouteData } from "solid-start"
import api from "~/lib/api"
import { useCourse } from "~/routes/(main)"
import { AllPages } from "."

export function routeData({ params }: RouteDataArgs) {
    const wiki =  api(`courses/${params.id}/pages/${params.page}`)
    const allPages = api(`courses/${params.id}/pages/`)
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