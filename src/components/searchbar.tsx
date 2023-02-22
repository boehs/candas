import { createShortcut } from "@solid-primitives/keyboard"
import { createActiveElement } from "@solid-primitives/active-element";
import { Accessor, createEffect, createSignal, JSX, Resource, Setter } from "solid-js"
import { unwrap } from "solid-js/store";

export function Searchbar(props: {
    context: string
    callback: Setter<string>
}) {    
    return <input
        type="text"
        class="search"
        placeholder={`Search your ${props.context}`}
        onInput={e => props.callback((e.target as HTMLInputElement).value)}
    />
}

const activeElm = createActiveElement()
export const kindShortcut: typeof createShortcut = (...args) => {
    createEffect(() => {
        if ((activeElm() && activeElm().tagName != 'INPUT') || !activeElm()) {
            createShortcut(...args)
        } 
    })
}

export default function createFilteredView<T>(unfiltered: Resource<T[]>, fn: (mod, search: Accessor<string>) => any, context: string) {
    const [search,setSearch] = createSignal('')
	const modules = () => {
		if (search()) {
			return unfiltered().flatMap(_mod => {
				const module = JSON.parse(JSON.stringify(unwrap(_mod)))
				return fn(module, search)
			})
		} else return unfiltered()
	}
	return [
        <Searchbar callback={setSearch} context={context}/>,
        modules
    ] as [JSX.Element, () => T[]]
}