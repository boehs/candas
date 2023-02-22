import { createContextProvider } from "@solid-primitives/context"
import { Resource } from "solid-js"
import { RouteDataArgs, useRouteData } from "solid-start"
import { Outlet } from "solid-start"
import api from "~/lib/api"

interface Announcement {
    title: string,
    posted_at: string,
    id: number,
    message: string
    url: string
}

export function routeData({params}: RouteDataArgs) {
    const annoucements = api<Announcement[]>(() => `announcements?context_codes[]=course_${params.id}`)
    return { annoucements }
}

export const [AnnouncementsContext,useAnnouncements] = createContextProvider((props: {
    resource: Resource<Announcement[]>
}) => {
    return props.resource
})

export default function Announcements() {
    const { annoucements } = useRouteData<typeof routeData>()
    
    return <AnnouncementsContext resource={annoucements}>
        <Outlet/>
    </AnnouncementsContext>
}