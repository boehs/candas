import { createShortcut } from "@solid-primitives/keyboard";
import { useNavigate } from "@solidjs/router";
import { A, Title, useParams } from "solid-start";
import { useCourse } from "~/routes/(main)";
import { useAnnouncements } from "../announcements";

export default function AnnoucementView() {
    const {setCourses} = useCourse()
    const params = useParams()
    const navigate = useNavigate()
    const annoucement = useAnnouncements()().find(annoucement => annoucement.id == Number(params.annoucement))
    
    if (annoucement) setCourses({instUrl: annoucement.url})
    
    createShortcut(['b'],() => navigate('../'))
    return <>
        <Title>{annoucement.title}</Title>
        <span>
            <span class="secondary">b</span>
            <A end={true} href={`/course/${params.id}/announcements`}>Go back</A>
        </span>
        <h1>{annoucement.title}</h1>
        <i>{new Date(annoucement.posted_at).toLocaleString()}</i>
        <div innerHTML={annoucement.message}/>
    </>
}