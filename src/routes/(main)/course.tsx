import { For } from "solid-js";
import { Outlet } from "solid-start";
import { mode, pages, setMode } from "../(main)";

export default function Course() {
    return <>
        <ul class="sticky">
            <For each={pages}>
                {item => <li><a class={`${mode() == item ? "active" : ""}`} href={`${item.toLowerCase()}`} onClick={() => setMode(item)}>{item}</a></li>}
            </For>
        </ul>
        <main>
            <Outlet/>
        </main>
    </>
}