"use client";
import { MAX_CARDS } from "@/const";
import useCoursesParams from "customhooks/use-courses-params";
import { useCallback } from "react";
import { useCoursesStore } from "store/courses/useCoursesStore";
import BarUI from "ui/menu/BarUI";
import { PaginationUI } from "ui/pagination/PaginationUI";

const Pagination = () => {
  // Hooks & States
  const { totalCourses } = useCoursesStore();
  const { getCurrentPage, setNewSearchParams } = useCoursesParams();
  const currentPage = getCurrentPage();

  // Methods
  const onChange = (page: number): void => {
    const newPage = page;
    setNewSearchParams(String(newPage));
  };

  const isWithBar = useCallback((): boolean => {
    if (
      totalCourses > 0 &&
      currentPage > 0 &&
      currentPage < Math.ceil(totalCourses / MAX_CARDS) + 1
    )
      return true;
    return false;
  }, [totalCourses, currentPage]);

  const isWithPagination = useCallback((): boolean => {
    if (totalCourses > MAX_CARDS) return true;
    return false;
  }, [totalCourses]);

  // Render
  return isWithBar() ? (
    <BarUI fixedInPosition="bottom" position="fixed" bgColor="bg-default-50">
      <div className="absolute flex justify-center items-center h-full left-3 top-0 z-50 text-white">
        Total course(s) : {totalCourses}
      </div>
      {isWithPagination() ? (
        <PaginationUI
          total={Math.ceil(totalCourses / MAX_CARDS)}
          initialPage={currentPage}
          onChange={onChange}
        />
      ) : (
        <div style={{ minHeight: 32 }}></div>
      )}
    </BarUI>
  ) : (
    <></>
  );
};

export default Pagination;
