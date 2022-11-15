import { For } from "solid-js";

export default function Table(props: {
    headers: any[],
    children: any
}) {
    return <table>
        <thead>
            <For each={props.headers}>
                {header => <th>{header}</th>}
            </For>
        </thead>
        <tbody>
            {props.children}
        </tbody>
    </table>
}