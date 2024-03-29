import { useEffect } from "react";
import { CourseService } from "lib";
import { TOnError, TOnFetch } from "./types";
import { useCoursesParams } from "customhooks";
import React from "react";

const GetCoursesByFilters = ({
  onFetch,
  onError,
}: {
  onFetch: TOnFetch;
  onError: TOnError;
}) => {
  const {
    getCurrentPage,
    getCurrentStatus,
    getCurrentFolder,
    getCurrentDate,
    getCurrentOrder,
  } = useCoursesParams();

  const currentPage = getCurrentPage();
  const currentStatus = getCurrentStatus();
  const currentFolder = getCurrentFolder();
  const currentDate = getCurrentDate();
  const currentOrder = getCurrentOrder();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courses = await CourseService.getCourses(
          `?page=${currentPage}&status=${currentStatus}&folder=${currentFolder}&date=${currentDate}&order=${currentOrder}`
        );
        const { data } = courses;

        onFetch(data as any);
      } catch (error: any) {
        onError(error?.message || "An error occurred");
      }
    };

    fetchData();
  }, [currentPage, currentStatus, currentOrder, currentFolder, currentDate]);

  return <></>;
};

export default GetCoursesByFilters;
