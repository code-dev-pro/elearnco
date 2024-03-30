import { useCoursesParams } from "customhooks";
import { useEffect, useRef } from "react";
import { useCourseStore } from "store";
import { LayoutEditorUI, LoadingSpinnerUI } from "ui";



export const CourseQuery = ({ courseId }: { courseId: string }) => {
  const { course, isLoading, error, fetchData } = useCourseStore();

  const { getCurrentPage } = useCoursesParams();
  const page = getCurrentPage();
  const isMonted = useRef<boolean>(false);
  //const refCurrentPage = useRef<number>(0);

  /* FETCH DATA */
  useEffect(() => {
   // if (page !== refCurrentPage.current) {
      fetchData(page, courseId);
      //refCurrentPage.current = page;
      isMonted.current = true;
   // }
  }, [page]);

  if (isLoading) return <LoadingSpinnerUI />;
  if (error) return <>Error</>;
  if (course && isMonted.current) return <LayoutEditorUI />;
};
