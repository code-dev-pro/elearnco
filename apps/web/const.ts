import { CourseDate, CourseStatus, CourseTitle } from "schemas/menus/dropdown";

export const IS_DEBUG = false;
export const IS_LOG_NODE = true;
export const IS_LOG_AUTOSAVE=true

export const ID_USER = "";
export const MAX_CARDS = 9;

export const PARENT_CSS = {
  display: "flex",
  flex: "1 1 auto",
  position: "relative",
  overflow: "hidden",
  minHeight: "100vh",
} as const;

export const WIDTH_SIDEBAR = 350;

export const DATA_STATUS = [
  {
    id: "98a5083c-4c82-11ee-be56-0242ac120002",
    name: "Published courses",
    value: CourseStatus.ACTIVE,
  },
  {
    id: "9c7991c6-4c82-11ee-be56-0242ac120002",
    name: "Archived courses",
    value: CourseStatus.ARCHIVED,
  },
  {
    id: "a3559b98-4c82-11ee-be56-0242ac120002",
    name: "Draft courses",
    value: CourseStatus.DRAFT,
  },
];
export const DATA_DATE = [
  {
    id: "78a5083d-4c82-11ee-ye56-0242ac120002",
    name: "Recently updated",
    value: CourseDate.RECENT,
  },
  {
    id: "8c7991c6-4c92-11ee-be56-0252ac120002",
    name: "Creation date",
    value: CourseDate.CREATED,
  },
];
export const DATA_TITLE = [
  {
    id: "45a5083d-4c92-11sx-ye56-0478ac120002",
    name: "Title(A-Z)",
    value: CourseTitle.AZ,
  },
  {
    id: "8c77554c6-a492-11ee-be56-4712bf120002",
    name: "Title(Z-A)",
    value: CourseTitle.ZA,
  },
];
