import { createEffect, For, Show, Suspense } from "solid-js"
import ErrorBoundary, { A, Outlet, useLocation, useNavigate } from "solid-start"
import { mode, pages, setMode, useCourse } from "../(main)"
import { useBeforeLeave } from '@solidjs/router'
import { kindShortcut } from "~/components/searchbar"

function Chips() {
    const { courses, setCourses } = useCourse()
    const navigate = useNavigate()

    useBeforeLeave(e => {
        setCourses({
            instUrl: false,
            prev: e.from.pathname
        })
    })

    createEffect(() => {
        if (courses.instUrl) {
            kindShortcut(['c'], () => window.location.href = courses.instUrl as string)
        }
    })
    kindShortcut(['b'], () => navigate(-1))

    return <div id="chips">
        <Show when={courses.prev != ''}>
            <span>
                <span class="secondary">b</span>
                {/* Fix this */}
                <A end={true} href={courses.prev}>Go back</A>
            </span>
        </Show>
        <Show when={courses.instUrl}>
            <span>
                <span class="secondary">c</span>
                <a href={courses.instUrl as string}>Open canvas</a>
            </span>
        </Show>
    </div>
}

export default function Course() {
    const navigate = useNavigate()
    const location = useLocation()

    const prefix = () => location.pathname.replace(new RegExp(`\/(${pages.map(page => page[0].toLowerCase()).join('|')}).*`), '')
    const path = (page) => `${prefix()}/${page[0].toLowerCase()}`
    pages.forEach((page) => {
        kindShortcut([page[1]], () => {
            setMode(page[0])
            navigate(path(page))
        })
    })

    return <>
        <ErrorBoundary>
            <ul class="sticky">
                <For each={pages}>
                    {item => <li>
                        <span class="secondary">{item[1]}</span>
                        <A class={`${mode() == item[0] ? "active" : ""}`} href={path(item)} onClick={() => setMode(item[0])}>{item[0]}</A>
                    </li>}
                </For>
            </ul>
        </ErrorBoundary>
        <ErrorBoundary>
            <main>
                <Chips />
                <Suspense>
                    <Outlet />
                </Suspense>
            </main>
        </ErrorBoundary>
    </>
}