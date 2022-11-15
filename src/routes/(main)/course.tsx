import { createShortcut } from "@solid-primitives/keyboard";
import { For } from "solid-js";
import ErrorBoundary, { A, Outlet, useLocation, useNavigate } from "solid-start";
import { mode, pages, setMode } from "../(main)";

export default function Course() {
    const navigate = useNavigate()
    const location = useLocation()

    const prefix = () => location.pathname.replace(new RegExp(`(${pages.map(page => page[0].toLowerCase()).join('|')}).*`),'')
    console.log(prefix())
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
                <Outlet />
            </main>
        </ErrorBoundary>
    </>
}