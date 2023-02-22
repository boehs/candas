import { createShortcut } from "@solid-primitives/keyboard";
import { createEffect, onCleanup } from "solid-js";
import { useTableContext } from "./table";

export default function Tr(props: {
    children: any
    goal: () => void,
    [key: string]: any
}) {
    const tableInfo = useTableContext()
    
    tableInfo.setN(1)
    onCleanup(() => {
        tableInfo.setN(-1)
    })
    
    const i = tableInfo.tblInf.n - 1
    
    const active = () => i == tableInfo.tblInf.a
    
    createEffect(() => {
        if (active()) createShortcut(['Enter'], () => props.goal())
    })

    return <tr {...props} class={`${active() ? 'focused' : ''}`}>
        {props.children}
    </tr>
}