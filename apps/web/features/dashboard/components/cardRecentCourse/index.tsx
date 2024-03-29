
import { useState } from "react";
import { CompleteCourse } from "schemas";
import CourseRecent from "./courseRecent";
import GetLastCourse from "./getLastCourse";

const CardRecentCourse = () => {
  const [courses, setCourses] = useState<CompleteCourse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleFetch = (result: CompleteCourse[]) => {
    setCourses(result);
    setError(null);
    setIsLoading(false);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  return (
    <>
      <GetLastCourse onFetch={handleFetch} onError={handleError} />
      <CourseRecent onLoading={isLoading} onError={error} courses={courses} />
    </>
  );
};

export default CardRecentCourse;
