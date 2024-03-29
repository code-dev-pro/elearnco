import { useEffect } from "react";
import { CompleteCourse } from "schemas";
import { CourseService } from "lib";
import { TOnError, TOnFetch } from "./types";

const GetLastCourse = ({
  onFetch,
  onError,
}: {
  onFetch: TOnFetch;
  onError: TOnError;
}) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const courses = await CourseService.getCourseMoreRecent();
        const { data } = courses;
        onFetch(data as CompleteCourse[]);
      } catch (error: any) {
        onError(error?.message || "An error occurred");
      }
    };

    fetchData();
  }, []);

  return null;
};

export default GetLastCourse;
