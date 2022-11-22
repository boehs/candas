import { createContextProvider } from "@solid-primitives/context"
import { Resource } from "solid-js"
import { RouteDataArgs, useRouteData } from "solid-start"
import { Outlet } from "solid-start"
import { createServerData$ } from "solid-start/server"
import api from "~/lib/api"

export function routeData({params}: RouteDataArgs) {
    const annoucements = createServerData$(async ([id],{request}) => await api(`announcements?context_codes[]=course_${id}`,{request}), {
        key: () => [params.id]
    })
    return { annoucements }
}

const [AnnouncementsContext,useAnnouncements] = createContextProvider((props: {
    resource: Resource<[{
        title: string,
        posted_at: string,
        id: number,
        message: string
        url: string
    }]>
}) => {
    return props.resource
})

export {useAnnouncements}

export default function Announcements() {
    const { annoucements } = useRouteData<typeof routeData>()
    
    return <AnnouncementsContext resource={annoucements}>
        <Outlet/>
    </AnnouncementsContext>
}