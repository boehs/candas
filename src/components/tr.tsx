import { createShortcut } from "@solid-primitives/keyboard";
import { createSignal, onCleanup } from "solid-js";

const [active,setActive] = createSignal(0)
let trs = []
export default function Tr(props: {
    children: any
}) {
    const i = trs[trs.length - 1] + 1 || 0
    const l = trs.push(i)
    
    onCleanup(() => {
        trs = trs.filter(e => e != i)
    })
    
    if (active() == i) {
        createShortcut(['ArrowDown'],() => setActive(trs[l+1]))
        createShortcut(['ArrowUp'],() => setActive(trs[l-1]))
    }
    
    return <tr class={`${active() == 0 ? 'focused' : ''}`}>
        {props.children}
    </tr>
}