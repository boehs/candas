import { createShortcut } from "@solid-primitives/keyboard"
import { createActiveElement } from "@solid-primitives/active-element";
import { createEffect, Setter } from "solid-js"

export default function Searchbar(props: {
    context: string
    callback: Setter<string>
}) {    

    return <input type="text" class="search" placeholder={`Search your ${props.context}`} onInput={e => props.callback(e.target.value)}/>
}

const activeElm = createActiveElement()
export const kindShortcut: typeof createShortcut = (...args) => {
    createEffect(() => {
        if ((activeElm() && activeElm().tagName != 'INPUT') || !activeElm()) {
            createShortcut(...args)
        } 
    })
}