import { createShortcut } from "@solid-primitives/keyboard";
import { createSignal, For, Resource } from "solid-js";
import { A, Outlet, useLocation, useNavigate, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import api from "~/lib/api";

export function routeData() {
  const courses: Resource<[{
    id: number
    name: string
  }]> = createServerData$(async () => await api('courses?enrollment_state=active'),{
    key: [false]
  })

  return { courses }
}


export const pages = ["Announcements", "Assignments", "Modules", "Wiki"] as const

export const [mode,setMode] = createSignal<typeof pages[number]>(pages[0])

export default function Main() {
  const location = useLocation()
  setMode(pages.find(v => location.pathname.includes(v.toLowerCase())))
  const navigate = useNavigate()
  const { courses } = useRouteData<typeof routeData>()
  
  if (courses()) courses().forEach((course,i) => createShortcut([`${i}`],() => navigate(`/course/${course.id}/${mode()}`))) 

  return (<>
    <section class="sticky">
      <ul>
        <For each={courses()}>
          {(course,i) => <li>
            <span style={{color: "gray"}}>{i()}</span>
            <A style={{ color: `hsl(${(360/courses().length)*i()},50%,60%)` }} end={false} href={`/course/${course.id}/${mode().toLowerCase()}`}>{course.name}</A>
          </li>}
        </For>
      </ul>
    </section>
    <Outlet />
  </>);
}
