"use client";
import { useEffect } from "react";
import { useCoursesStore } from "store";
import CoursesCollectionList from "../list";
import CourseAdd from "../add";
import CourseLoading from "../loading";
import { useCoursesParams } from "customhooks";


const CoursesQuery = ({ query }: { query: string }) => {
  const { fetchData, isLoading, error } = useCoursesStore();
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

  const _getCourses = async (): Promise<void> =>
    await fetchData(
      currentPage,
      currentStatus,
      currentOrder,
      currentFolder,
      currentDate
    );

  useEffect(() => {
    _getCourses();
  }, [currentPage, currentStatus, currentOrder, currentFolder, currentDate]);

  if (error) return <p>error</p>;
  if (isLoading) return <CourseLoading />;
  return (
    <>
      <CourseAdd />
      <CoursesCollectionList query={query} />
    </>
  );
};

export default CoursesQuery;
