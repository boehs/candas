import { For } from "solid-js";
import { Outlet } from "solid-start";
import { pages } from "../(main)";

export default function Course() {
    return <>
        <ul>
            <For each={pages}>
                {item => <li><a href={`${item.toLowerCase()}`}>{item}</a></li>}
            </For>
        </ul>
        <main>
            <Outlet/>
        </main>
    </>
}