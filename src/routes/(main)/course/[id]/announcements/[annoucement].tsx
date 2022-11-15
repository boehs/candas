import { A, useParams } from "solid-start";
import { useAnnouncements } from "../announcements";

export default function AnnoucementView() {
    const params = useParams()
    const annoucement = useAnnouncements()().find(annoucement => annoucement.id == Number(params.annoucement))
    return <>
        <A end={true} href={`/course/${params.id}/announcements`}>Go back</A>
        <h1>{annoucement.title}</h1>
        <i>{new Date(annoucement.posted_at).toLocaleString()}</i>
        <div innerHTML={annoucement.message}/>
    </>
}