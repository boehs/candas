import { A, useParams } from "solid-start";
import { useAnnouncements } from "../../(announcements)";

export default function AnnoucementView() {
    const params = useParams()
    const annoucement = useAnnouncements()().find(annoucement => annoucement.id == Number(params.annoucement))
    return <>
        <A href={`/course/${params.id}/announcements`}>Go back</A>
        <h1>{annoucement.title}</h1>
        <i>{annoucement.posted_at}</i>
        <div innerHTML={annoucement.message}/>
    </>
}