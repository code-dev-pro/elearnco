"use client";
import React from "react";
import { useCourseStore } from "store";

export const CourseTitleUI = () => {
  const { course } = useCourseStore();

  return <div className="select-none ml-2">{course.title}</div>;
};
