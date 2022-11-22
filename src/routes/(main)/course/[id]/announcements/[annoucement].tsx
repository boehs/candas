import { createShortcut } from "@solid-primitives/keyboard";
import { createEffect } from "solid-js";
import { A, Title, useParams } from "solid-start";
import { useCourse } from "~/routes/(main)";
import { useAnnouncements } from "../announcements";

export default function AnnoucementView() {
    const {setCourses} = useCourse()
    const params = useParams()
    const annoucement = useAnnouncements()().find(annoucement => annoucement.id == Number(params.annoucement))
    
    createEffect(() => { if (annoucement) setCourses({instUrl: annoucement.url}) })

    return <>
        <Title>{annoucement.title}</Title>
        <h1>{annoucement.title}</h1>
        <i>{new Date(annoucement.posted_at).toLocaleString()}</i>
        <div innerHTML={annoucement.message}/>
    </>
}