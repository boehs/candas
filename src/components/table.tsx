import { createContextProvider } from "@solid-primitives/context";
import { createShortcut } from "@solid-primitives/keyboard";
import { For } from "solid-js";
import { createStore } from "solid-js/store";

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

export const [TableContext,useTableContext] = createContextProvider(() => {
    const [tblInf,setTblInf] = createStore<{
        a: number,
        n: number
    }>({
        a: 0,
        n: 0
    })
    
    const tableInfo = {
        setN: (increment: 1 | -1) => setTblInf("n", n => n + increment),
        setActive: (increment: 1 | -1) => {
            const incremented = tblInf.a + increment
            if (incremented >= tblInf.n || 0 > incremented) return
            else setTblInf("a",incremented)
        },
        tblInf
    }
    
    createShortcut(['ArrowDown'], () => tableInfo.setActive(1))
    createShortcut(['ArrowUp'], () => tableInfo.setActive(-1))
    
    return tableInfo
})