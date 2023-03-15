import { A, useNavigate } from "@solidjs/router"
import { createEffect, For, Show } from "solid-js"
import { Dynamic } from "solid-js/web"
import { RouteDataArgs, Title, useParams, useRouteData } from "solid-start"
import createFilteredView from "~/components/searchbar"
import Table, { TableContext } from "~/components/table"
import Tr from "~/components/tr"
import api from "~/lib/api"
import { listOpenShim } from "~/lib/courses"
import { camelToTitle } from "~/lib/helpers"
import { useCourse } from "~/routes/(main)"

type Module = {
	id: number
	title: string
	position: number
	indent: number
	type: string
	url: string
	content_id?: number
	external_url?: string
}

type ModuleList = {
	name: string
	position: number
	items: Module[]
}[]

export function routeData({ params }: RouteDataArgs) {
	const modules = api<ModuleList>(() => `courses/${params.id}/modules?include[]=items`, {
		postprocess: (r) => r.map(module => {
			module.items = module.items.map(item => {
				// Edgecase: Assignments
				if (item.content_id) item.id = item.content_id
				// Edgecase: Wiki
				if (item.type == 'Page') item.id = item.page_url as number
				return item
			})
		})
	})
	return { modules }
}

const maps = {
	internal: {
		'Assignment': 'assignments',
		'Discussion': 'announcements',
		'Page': 'wiki'
	},
	external: {
		'Quiz': (mod: Module) => mod.url.replace('api/v1/', '')
	}
}

function resolveUrl(mod: Module): ['A' | 'a', string] | null {
	if (mod.id && maps.internal[mod.type])
		return ['A', `../${maps.internal[mod.type]}/${mod.id}`]
	if (maps.external[mod.type])
		return ['a', maps.external[mod.type](mod)]
	if (mod.external_url)
		return ['a', mod.external_url]
	return null
}

function ResolveUrl(props: {
	item: Module
}) {
	const resolved = resolveUrl(props.item)

	return <Dynamic component={!resolved ? 'span' : resolved[0] == 'A' ? A : 'a'} href={resolved ? resolved[1] : null}>
		{props.item.title}
	</Dynamic>
}

export default function Modules() {
	const { modules: unfilteredModules } = useRouteData<typeof routeData>()
	const navigate = useNavigate()
	const { findCourse } = useCourse()
	const navigateShim = (location: string) => {
		try {
			navigate(location)
		} catch {
			window.location.replace(location)
		}
	}

	const [Searchbar, modules] = createFilteredView(unfilteredModules, (module, search) => {
		module.items = module.items.filter(item => item.title.includes(search()))
		return [module]
	}, 'modules')

	const params = useParams()
	
	createEffect(listOpenShim(() => params.id,'modules'))

	return <>
		<Title>Modules: {findCourse(params.id) ? findCourse(params.id).name : params.id}</Title>
		{Searchbar}
		<TableContext>
			<For each={modules()} fallback={<p>Your teacher has not posted any modules yet</p>}>
				{module => <details open={module.items.length > 0}>
					<summary>{module.name}</summary>
					<Table headers={['Title', 'Type']}>
						<For each={module.items}>
							{item => <Show when={item.type != 'SubHeader'} fallback={<tr>
								<td style={{
									"display": "inline-block",
									"margin-left": `${item.indent * 30}px`
								}}>
									<ResolveUrl item={item} />
								</td>
								<td />
							</tr>}>
								<Tr goal={() => navigateShim(resolveUrl(item, params.id)[1])}>
									<td style={{
										"display": "inline-block",
										"margin-left": `${item.indent * 30}px`
									}}>
										<ResolveUrl item={item} />
									</td>
									<td>{camelToTitle(item.type)}</td>
								</Tr>
							</Show>}
						</For>
					</Table>
				</details>}
			</For>
		</TableContext>
	</>
}