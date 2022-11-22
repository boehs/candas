import { createShortcut } from "@solid-primitives/keyboard";
import { For, Show } from "solid-js";
import ErrorBoundary, { A, Outlet, useLocation, useNavigate } from "solid-start";
import { mode, pages, setMode, useCourse } from "../(main)";
import { useBeforeLeave } from '@solidjs/router'

function Chips() {
    const { courses, setCourses } = useCourse()
    const navigate = useNavigate()

    useBeforeLeave(e => {
        setCourses({
            instUrl: false,
            prev: e.from.pathname
        })
    })

    // @ts-expect-error
    createShortcut(['c'], () => window.location.href = courses.instUrl)
    createShortcut(['b'], () => navigate(courses.prev))

    return <div id="chips">
        <Show when={courses.prev != ''}>
            <span>
                <span class="secondary">b</span>
                <A end={true} href={courses.prev}>Go back</A>
            </span>
        </Show>
        <Show when={courses.instUrl}>
            <span>
                <span class="secondary">c</span>
                {/*@ts-expect-error*/}
                <a end={true} href={courses.instUrl}>Open canvas</a>
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
        createShortcut([page[1]], () => {
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
                <Outlet />
            </main>
        </ErrorBoundary>
    </>
}