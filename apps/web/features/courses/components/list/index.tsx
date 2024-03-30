import { CompleteCourse } from "schemas";
import { useCoursesStore } from "store/courses/useCoursesStore";
import { CardUI } from "ui";

const CoursesCollectionList = ({ query }: { query: string }) => {
  const { courses } = useCoursesStore();

  const filterCollection = ():CompleteCourse[] => {
    if (!query || query.trim() === "") {
      return courses;
    } else {
      query = query.trim().toLowerCase();
      return courses.filter((obj: CompleteCourse) =>
        obj.title.toLowerCase().startsWith(query)
      );
    }
  };

  return filterCollection()?.map((course: CompleteCourse) => (
    <CardUI key={course.id} {...course} />
  ));
};

export default CoursesCollectionList;
