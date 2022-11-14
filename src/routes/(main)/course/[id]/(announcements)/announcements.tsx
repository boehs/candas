import { For } from "solid-js"
import { A } from "solid-start"
import { useAnnouncements } from "../(announcements)"

export default function Announcements() {
    const announcements = useAnnouncements()
    
    return <>
        <table>
            <tr>
                <th>Title</th>
                <th>Date</th>
            </tr>
            <For each={announcements()}>
                {announcement => <tr>
                    <td><A href={`../announcement/${announcement.id}`}>{announcement.title}</A></td>
                    <td>{(new Date(announcement.posted_at)).toLocaleDateString()}</td>
                </tr>}
            </For>
        </table>
    </>
}