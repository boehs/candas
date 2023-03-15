import { useCourse } from "~/routes/(main)"

export const listOpenShim = (id: () => string, end: string) => {
    const {setCourses,findCourse} = useCourse()
    const course = () => { if(id) return findCourse(id()) }
    // Hack
    return () => { if(setCourses && course()) setCourses({ instUrl: `${course().calendar.ics.replace(/\/feeds.*/,'')}/courses/${id()}/${end}` }) }
}
