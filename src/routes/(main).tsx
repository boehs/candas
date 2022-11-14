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

function stringToColour(stringInput) {
  let stringUniqueHash = [...stringInput].reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return `hsl(${stringUniqueHash % 360}, 30%, 50%)`;
}


export const pages = ["Announcements", "Assignments", "Modules", "Wiki"] as const

export default function Main() {
  const { courses } = useRouteData<typeof routeData>()

  return (<>
    <section class="sticky">
      <ul>
        <For each={courses()}>
          {course => <li><A style={{ color: stringToColour(course.name) }} end={false} href={`/course/${course.id}/${"wiki"}`}>{course.name}</A></li>}
        </For>
      </ul>
    </section>
    <Outlet />
  </>);
}
