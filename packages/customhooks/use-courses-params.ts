"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next13-progressbar";

import { CourseDate, CourseStatus, CourseTitle, ERoutes } from "schemas";
export function useCoursesParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentUserCollaboration =searchParams.get("collaborator") || undefined;
  const currentCourseMode =searchParams.get("mode") || 'authoring';
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentStatus =
    (searchParams.get("status") as CourseStatus) || CourseStatus.ACTIVE;
  const currentFolder = searchParams.get("folder") || "Default";
  const currentDate =
    (searchParams.get("date") as CourseDate) || CourseDate.RECENT;
  const currentOrder =
    (searchParams.get("order") as CourseTitle) || CourseTitle.AZ;

  const getCurrentStatus = (): CourseStatus =>
    currentStatus || CourseStatus.ACTIVE;
  const getCurrentFolder = (): string => currentFolder || "Default";
  const getCurrentCourseMode = (): string => currentCourseMode || "authoring";
  const getCurrentDate = (): CourseDate => currentDate || CourseDate.RECENT;
  const getCurrentOrder = (): CourseTitle => currentOrder || CourseTitle.AZ;
  const getCurrentPage = (): number => currentPage || 1;
  const getCurrentUserCollaboration = (): string |undefined => currentUserCollaboration || undefined;
  const setNewSearchParamsInCurrentPage = (
    statusParam: string,
    folderParam: string,
    dateParam: string,
    orderParam: string
  ) => {
    router.push(
      `/${ERoutes.COURSES}/?page=${currentPage}&status=${statusParam}&folder=${folderParam}&date=${dateParam}&order=${orderParam}`
    );
  };

  const setNewSearchParams = (pageParam: string): void => {
    router.push(
      `/${
        ERoutes.COURSES
      }/?page=${pageParam}&status=${getCurrentStatus()}&folder=${getCurrentFolder()}&date=${getCurrentDate()}&order=${getCurrentOrder()}`
    );
  };

 

  return {
    currentPage,
    currentStatus,
    currentFolder,
    currentDate,
    currentOrder,
    currentUserCollaboration,
    currentCourseMode,
    getCurrentCourseMode,
    getCurrentUserCollaboration,
    setNewSearchParamsInCurrentPage,
    setNewSearchParams,
    getCurrentPage,
    getCurrentStatus,
    getCurrentFolder,
    getCurrentDate,
    getCurrentOrder,
  };
}

export default useCoursesParams;
