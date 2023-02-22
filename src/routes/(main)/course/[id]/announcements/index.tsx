import { useNavigate, useParams } from "@solidjs/router"
import { For } from "solid-js"
import { A, Title } from "solid-start"
import Table, { TableContext } from "~/components/table"
import Tr from "~/components/tr"
import { useCourse } from "~/routes/(main)"
import { useAnnouncements } from "../announcements"

export default function Announcements() {
    const { findCourse } = useCourse()
    const navigate = useNavigate()
    const announcements = useAnnouncements()
    const params = useParams()

    return <Table headers={['Title', 'Date']}>
        <Title>Announcements for {findCourse(params.id).name}</Title>
        <TableContext>
            <For each={announcements()}>
                {announcement => <Tr goal={() => navigate(`../announcements/${announcement.id}`)}>
                    <td><A href={`../announcements/${announcement.id}`}>{announcement.title}</A></td>
                    <td>{(new Date(announcement.posted_at)).toLocaleDateString()}</td>
                </Tr>}
            </For>
        </TableContext>
    </Table>
}