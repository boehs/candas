import { For } from "solid-js";
import { A, Outlet, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import api from "~/lib/api";

export function routeData() {
  const courses = createServerData$(async () => await api('courses?enrollment_state=active'),{
    key: [false]
  })

  return { courses }
}


export const pages = ["Announcements", "Assignments", "Modules", "Wiki"] as const

export default function Main() {
  const { courses } = useRouteData<typeof routeData>()

  return (<>
    <section class="sticky">
      <ul>
        <For each={courses()}>
          {(course,i) => <li><A style={{ color: `hsl(${(360/courses().length)*i()},50%,60%)` }} end={false} href={`/course/${course.id}/${"wiki"}`}>{course.name}</A></li>}
        </For>
      </ul>
    </section>
    <Outlet />
  </>);
}
