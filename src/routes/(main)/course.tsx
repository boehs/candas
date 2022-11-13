import { A } from "@solidjs/router";
import { For } from "solid-js";
import { Outlet } from "solid-start";
import { pages, setMode } from "../(main)";

export default function Course() {
    return <>
        <ul>
            <For each={pages}>
                {item => <li><A href={`${item.toLowerCase()}`} onclick={() => setMode(item)}>{item}</A></li>}
            </For>
        </ul>
        <main>
            <Outlet/>
        </main>
    </>
}