import { useCoursesParams } from "customhooks";
import { useEffect, useRef } from "react";
import { useCourseStore } from "store";
import { LayoutEditorUI, LoadingSpinnerUI } from "ui";

//TODO - WRITE A COMPONENT FOR MANAGING Errors

export const CourseQuery = ({ courseId }: { courseId: string }) => {
  const { course, isLoading, error, fetchData } = useCourseStore();

  const { getCurrentPage } = useCoursesParams();
  const page = getCurrentPage();
  const isMonted = useRef<boolean>(false);
  useEffect(() => {
    fetchData(page, courseId);
    isMonted.current = true;
  }, [page]);

  if (isLoading) return <LoadingSpinnerUI />
  if (error) return <>Error</>;
  if (course && isMonted.current) return <LayoutEditorUI />;
};
