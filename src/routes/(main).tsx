import { createContextProvider } from "@solid-primitives/context"
import { createSignal, For, Show, Suspense } from "solid-js"
import { createStore } from "solid-js/store"
import ErrorBoundary, { A, Link, Outlet, useIsRouting, useLocation, useNavigate, useRouteData } from "solid-start"
import { kindShortcut } from "~/components/searchbar"
import Spinner from "~/components/spinner"
import api from "~/lib/api"

export function routeData() {
  const courses = api<[{
    id: number
    name: string
    concluded: boolean,
    calendar: {
      ics: string
    }
  }]>(() => 'courses?enrollment_state=active&include[]=concluded&per_page=100', {
    postprocess: (res) => res.filter(course => !course.concluded)
  })

  return { courses }
}

type Data = ReturnType<typeof routeData>

export const [CourseContext, useCourse] = createContextProvider((props: {
  courses: Data['courses']
}) => {
  const [courses, setCourses] = createStore({
    courses: props.courses,
    quarters: false as (false | { [key: number]: any }),
    instUrl: false as (false | string),
    prev: ''
  })

  const findCourse = (id: number | string) => (courses.courses() || []).find(course => course.id == Number(id))
  const findCourseIndex = (id: number | string) => (courses.courses() || []).findIndex(course => course.id == Number(id))

  return { courses, findCourse, setCourses, findCourseIndex }
})

export const pages = [["Announcements", "n", "📣"], ["Assignments", "a", "📝"], ["Modules", "m", "📦"], ["Wiki", "w", "📰"]] as const

export const [mode, setMode] = createSignal<typeof pages[number][number]>(pages[0][0])

export default function Main() {
  const location = useLocation()
  const navigate = useNavigate()
  const isRouting = useIsRouting()

  const search = pages.find(v => location.pathname.includes(v[0].toLowerCase()))
  setMode(search ? search[0] : pages[0][0])

  const { courses } = useRouteData<typeof routeData>()
  if (courses()) courses().forEach((course, i) => kindShortcut([`${i}`], () => navigate(`/course/${course.id}/${mode().toLowerCase()}`)))
  return (<>
    <Link rel="icon" href={`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${pages.find(page => page[0] == mode())[2]}</text></svg>`} />
    <ErrorBoundary>
      <section>
        <ul>
          <li>
            <A end={true} href="/">
              <header>
                <h2>
                  Candas
                  <Show when={isRouting()}>
                    <Spinner />
                  </Show>
                </h2>
                <sup class="secondary">By 🏕️ Humanateam</sup>
              </header>
            </A>
          </li>
          <Suspense>
            <For each={courses()}>
              {(course, i) => <li>
                <A
                  //style={{ color: `hsl(${(360 / courses().length) * i()},50%,60%)`
                  //}}
                  end={false}
                  href={`/course/${course.id}/${mode().toLowerCase()}`}
                >
                  <span class="secondary">{i()}</span>
                  {course.name.replace(/- .*/, '').trim()}
                </A>
              </li>}
            </For>
          </Suspense>
        </ul>
        <Suspense>
          <CourseContext courses={courses}>
            <Outlet />
          </CourseContext>
        </Suspense>
      </section>
    </ErrorBoundary>
  </>)
}
