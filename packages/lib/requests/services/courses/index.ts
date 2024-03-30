import { 
  addCourse,
  deleteCourse,
  getCourse,
  getCourseMoreRecent,
  getCourses,
  updateCourse } 
  from "../../api.request";

export const CourseService = {
  getCourseMoreRecent,
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
};
