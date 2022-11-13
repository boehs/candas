import { createSignal, For } from "solid-js";
import { A, Outlet, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import api from "~/lib/api";

export function routeData() {
  const courses = createServerData$(async () => await api('courses?enrollment_state=active'))

  return { courses }
}

export const pages = ["Announcements", "Assignments", "Modules", "Grades", "Wiki"] as const
export const [mode,setMode] = createSignal<typeof pages[number]>("Announcements")

export default function Main() {
  const { courses } = useRouteData<typeof routeData>()

  return (<>
    {mode()}
    <section>
      <ul>
        <For each={courses()}>
          {course => <li><A end={false} href={`/course/${course.id}/${(mode()).toLowerCase()}`}>{course.name}</A></li>}
        </For>
      </ul>
    </section>
    <Outlet />
  </>);
}
