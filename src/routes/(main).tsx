import { createShortcut } from "@solid-primitives/keyboard";
import { createSignal, For, Resource, Show } from "solid-js";
import ErrorBoundary, { A, Outlet, useIsRouting, useLocation, useNavigate, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import Spinner from "~/components/spinner";
import api from "~/lib/api";

export function routeData() {
  const courses: Resource<[{
    id: number
    name: string
  }]> = createServerData$(async () => await api('courses?enrollment_state=active'), {
    key: [false]
  })

  return { courses }
}


export const pages = [["Announcements", "n"], ["Assignments", "a"], ["Modules", "m"], ["Wiki", "w"]] as const

export const [mode, setMode] = createSignal<typeof pages[number][number]>(pages[0][0])

export default function Main() {
  const location = useLocation()
  const navigate = useNavigate()
  const isRouting = useIsRouting()
  
  const search = pages.find(v => location.pathname.includes(v[0].toLowerCase()))
  setMode(search ? search[0] : pages[0][0])

  const { courses } = useRouteData<typeof routeData>()

  if (courses()) courses().forEach((course, i) => createShortcut([`${i}`], () => navigate(`/course/${course.id}/${mode().toLowerCase()}`)))

  return (<>
    <header>
      <h2>
        <A end={true} href="/">Candas</A>
        <Show when={isRouting()}>
          <Spinner />
        </Show>
      </h2>
      <sup>By 🏕️ Humanity</sup>
    </header>
    <ErrorBoundary>
      <div id="content">
        <section class="sticky">
          <ul>
            <For each={courses()}>
              {(course, i) => <li>
                <span class="secondary">{i()}</span>
                <A style={{ color: `hsl(${(360 / courses().length) * i()},50%,60%)` }} end={false} href={`/course/${course.id}/${mode().toLowerCase()}`}>{course.name}</A>
              </li>}
            </For>
          </ul>
        </section>
        <Outlet />
      </div>
    </ErrorBoundary>
  </>);
}
