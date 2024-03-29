"use client";
import { useCoursesParams } from "customhooks";
import { getId } from "lib";
import { useCallback } from "react";
import {  SelectUI } from "ui";
import { DATA_DATE, DATA_STATUS, DATA_TITLE } from "@/const";
import FolderFilter from "./folderFilter";
import Search  from "./search"
//TODO - TRANSLATION


const CourseFilters = () => {
  
  // Hooks & States
  const {
    currentPage,
    currentStatus,
    currentFolder,
    currentDate,
    currentOrder,
    setNewSearchParamsInCurrentPage,
  } = useCoursesParams();
  
  

  const updateSearchParams = useCallback(
    (
      newStatus: string | null,
      newFolder: string | null,
      newDate: string | null,
      newOrder: string | null
    ) => {
      const statusParam = newStatus ?? "";
      const folderParam = newFolder ?? "";
      const dateParam = newDate ?? "";
      const orderParam = newOrder ?? "";
      setNewSearchParamsInCurrentPage(
        statusParam,
        folderParam,
        dateParam,
        orderParam
      );
    },
    [currentPage, currentStatus, currentFolder, currentDate, currentOrder]
  );
  const _changeHandlerStatus = useCallback(
    (value: string) => {
      const course = DATA_STATUS.filter((item) => value === item.id);
      if (course.length > 0) {
        updateSearchParams(
          course[0].value,
          currentFolder,
          currentDate,
          currentOrder
        );
      }
    },
    [currentFolder, currentDate, currentOrder]
  );
  const _changeHandlerFolder = useCallback(
    (value: string) => {
      updateSearchParams(currentStatus, value, currentDate, currentOrder);
    },
    [currentStatus, currentDate, currentOrder]
  );
  const _changeHandlerOrder = useCallback(
    (value: string) => {
      const course = DATA_TITLE.filter((item) => value === item.id);
      if (course.length > 0) {
        updateSearchParams(
          currentStatus,
          currentFolder,
          currentDate,
          course[0].value
        );
      }
    },
    [currentStatus, currentFolder, currentDate]
  );
  const _changeHandlerDate = useCallback((value: string):void => {
    const course = DATA_DATE.filter((item) => value === item.id);
    if (course.length > 0) {
      updateSearchParams(
        currentStatus,
        currentFolder,
        course[0].value,
        currentOrder
      );
    }
  }, []);

  // Render
  return (
    <div className="flex items-center justify-between w-full h-16 sticky z-50 backdrop-blur-sm">
      <div className="flex gap-2 items-center justify-start">
        <SelectUI
          data={DATA_STATUS}
          variant="flat"
          label="Filter by status"
          placeholder="Published courses"
          labelPlacement="inside"
          onChange={_changeHandlerStatus}
          selectedKey={getId(DATA_STATUS, currentStatus)}
        />
        <FolderFilter
          currentFolder={currentFolder || "Default"}
          onChange={_changeHandlerFolder}
        />
        <SelectUI
          data={DATA_DATE}
          label="Filter by date"
          placeholder="Recently updated"
          labelPlacement="inside"
          onChange={_changeHandlerDate}
          variant="flat"
          selectedKey={getId(DATA_DATE, currentDate)}
        />
        <SelectUI
          data={DATA_TITLE}
          label="Filter by title"
          placeholder="Title (A-Z)"
          labelPlacement="inside"
          variant="flat"
          onChange={_changeHandlerOrder}
          selectedKey={getId(DATA_TITLE, currentOrder)}
        />
      </div>
      <Search/>
      
    </div>
  );
};

export default CourseFilters;
