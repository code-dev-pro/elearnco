import { CourseService } from "lib";
import { useEffect } from "react";
import { ErrorResponse } from "schemas/api";
import { CompleteCourse } from "schemas/zod/course";

export type TOnFetch = (result: CompleteCourse[]) => void;
export type TOnError = (error: ErrorResponse | undefined) => void;

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