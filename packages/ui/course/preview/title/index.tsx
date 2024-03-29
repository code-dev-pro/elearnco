import React from "react";
import { useCourseStore } from "store";

import TypographyUI from "../../../typography/TypographyUI";

const CourseTitle = () => {
  const { course } = useCourseStore();
  const titleCourse = course?.title ? course.title : "Title";

  if (titleCourse && titleCourse !== "")
    return (
      <TypographyUI className="p-4">
        <TypographyUI.Title
          level={3}
          style={{ marginBottom: "0.5rem", fontWeight: "bold" }}
        >
          {titleCourse}
        </TypographyUI.Title>
      </TypographyUI>
    );

  return <></>;
};

export default CourseTitle;
