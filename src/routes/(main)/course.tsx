import { createShortcut } from "@solid-primitives/keyboard";
import { For } from "solid-js";
import ErrorBoundary, { A, Outlet, useLocation, useNavigate } from "solid-start";
import { mode, pages, setMode } from "../(main)";

export default function Course() {
    const navigate = useNavigate()
    const location = useLocation()

    const prefix = () => location.pathname.substring(0, location.pathname.lastIndexOf("/"))
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
                        <span style={{ color: "gray" }}>{item[1]}&nbsp;</span>
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