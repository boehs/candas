import { useNavigate } from "@solidjs/router"
import { For } from "solid-js"
import { A } from "solid-start"
import Table from "~/components/table"
import Tr from "~/components/tr"
import { useAnnouncements } from "../announcements"

export default function Announcements() {
    const navigate = useNavigate()
    const announcements = useAnnouncements()

    return <Table headers={['Title', 'Date']}>
        <For each={announcements()}>
            {announcement => <Tr goal={() => navigate(`../announcements/${announcement.id}`)}>
                <td><A href={`../announcements/${announcement.id}`}>{announcement.title}</A></td>
                <td>{(new Date(announcement.posted_at)).toLocaleDateString()}</td>
            </Tr>}
        </For>
    </Table>
}