import { useCoursesParams } from "customhooks";
import { getCourseId } from "lib";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useCourseStore } from "store";
import { LoadingSpinnerUI } from "ui";

export const CourseQueryGeneric = (props: React.PropsWithChildren) => {
  const pathname = usePathname();
  const courseID = getCourseId(pathname);
  const { getCurrentPage } = useCoursesParams();
  const { course, isLoading, error, fetchData } = useCourseStore();
  const page = getCurrentPage();
  const isMonted = useRef<boolean>(false);

  useEffect(() => {
    fetchData(page, courseID);
    isMonted.current = true;
  }, [page]);

  if (isLoading) return <LoadingSpinnerUI />;
  if (error) return <p>{JSON.stringify(error)}</p>;
  if (course && isMonted.current) return props.children;
};

//export const CourseQueryWithCollaboration = () => {
  //const { doc } = useCollaboration();
  //const [block, setBlock] = useYMapItem<any[]>(doc?.getMap("page"), "block");
 // return <CourseQueryGeneric />;
//};
