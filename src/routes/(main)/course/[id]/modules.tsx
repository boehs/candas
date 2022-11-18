import { A, useNavigate } from "@solidjs/router"
import { For, Match, Resource, Show, Switch } from "solid-js"
import { RouteDataArgs, Title, useParams, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import Table from "~/components/table"
import Tr from "~/components/tr"
import gclc from "~/lib/gql"

type Module = {
    createdAt: string
    content: {
        __typename: string
        id?: string
        url?: string
        title: string
    }
}

type ModuleList = {
    name: string
    items: Module[]
}[]

export function routeData({ params }: RouteDataArgs) {
    const modules: Resource<ModuleList> = createServerData$(async ([id]) => await gclc.query(`query ($id: ID) {
        course(id: $id) {
          modulesConnection {
            nodes {
              name
              items: moduleItems {
                createdAt
                content {
                  ... on Page {
                    __typename
                    id: _id
                    title
                  }
                  ... on Assignment { 
                    __typename
                    id
                    title: name
                  }
                  ... on Discussion {
                    __typename
                    id
                    title
                  }
                  ... on Quiz {
                    __typename
                    id: _id
                    modules {
                      name
                    }
                  }
                  ... on ExternalUrl {
                    __typename
                    _url: url
                    title
                  }
                  ... on ExternalTool {
                    __typename
                    url
                    title: name
                  }
                  ... on File {
                    __typename
                    url
                  }
                  ... on SubHeader {
                    title
                  }
                }
              }
            }
          }
        }
      }`,{
        id: id
      }).toPromise().then(res => {
        const data = res.data.course.modulesConnection.nodes
        return data.map(node => {
            node.items = node.items.map(item => {
                if (item.content._url) item.content.url = item.content._url
                if (item.content.modules) {
                  item.content.title = item.content.modules[0].name
                }
                return item
            })
            return node
        })
      }), {
        key: () => [params.id]
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
        'Quiz': (mod: Module, course: any) => `https://${process.env.ENDPOINT}/courses/${course}/quizzes/${mod.content.id}`
    }
}

function resolveUrl(mod: Module, course: any): ['A' | 'a', string] | null {
    if (mod.content.id && maps.internal[mod.content.__typename])
        return ['A',`../${maps.internal[mod.content.__typename]}/${mod.content.id}`]
    if (maps.external[mod.content.__typename])
        return ['a',maps.external[mod.content.__typename](mod,course)]
    if (mod.content.url)
        return ['a',mod.content.url]
    return null
}

function ResolveUrl(props: {
    item: Module
    course: any
}) {
    const resolved = resolveUrl(props.item, props.course)
    return <Switch>
        <Match when={!resolved}>
            {props.item.content.title}
        </Match>
        <Match when={resolved[0] == 'A'}>
            <A href={resolved[1]}>{props.item.content.title}s</A>
        </Match>
        <Match when={resolved[0] == 'a'}>
            <i><a href={resolved[1]}>{props.item.content.title}</a></i>
        </Match>
    </Switch>
}

export default function Modules() {
    const { modules } = useRouteData<typeof routeData>()
    const navigate = useNavigate()
    const navigateShim = (location: string) => {
        try {
            navigate(location)
        } catch {
            window.location.replace(location)
        }
    }
    const params = useParams()
    return <>
        <Title>Modules: {params.id}</Title>
        <For each={modules()}>
            {module => <details open>
                <summary>{module.name}</summary>
                <Table headers={['Title', 'Created At', 'Type']}>
                    <For each={module.items}>
                        {item => <Tr goal={() => navigateShim(resolveUrl(item,params.id)[1])}>
                            <td /*style={{
                                "display": "inline-block",
                                "margin-left": `${item.indent * 30}px`
                            }}*/>
                                <Show when={item.content.__typename == 'SubHeader'} fallback={
                                    <ResolveUrl item={item} course={params.id} />
                                }>
                                    <h3><ResolveUrl item={item} course={params.id} /></h3>
                                </Show>
                            </td>
                            <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                            <td>{item.content.__typename}</td>
                        </Tr>}
                    </For>
                </Table>
            </details>}
        </For>
    </>
}