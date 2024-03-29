"use client";
import React, { PropsWithChildren } from "react";
import dynamic from "next/dynamic";
import CoursePagination from "./pagination";
import TitlePageComponent from "./pagination/components/titlePageComponent";
import BarUI from "ui/menu/BarUI";
import useCoursesParams from "customhooks/use-courses-params";
import { LayoutEditorUI } from "ui";
import { CourseQueryGeneric } from "./query/courseQueryGeneric";
import { EModeEditor } from "schemas";
import AuthoringMode from "./editor/classic";
import { useIsCollaboration } from "customhooks";
// import CollaborationAuth from "./editor/collaboration";
import Collaboration from "./editor/collaboration";

//TODO RENAME LayoutEditorUI TO AuthorEditor

const DynamicAuthorEditor = dynamic(() => import("./editor/classic/author"), {
  loading: () => <></>,
});
const DynamicAdapativeEditor = dynamic(
  () => import("./editor/classic/adaptive"),
  {
    loading: () => <></>,
  }
);
const CourseQuery = React.memo((props: PropsWithChildren) => {
  const { children } = props;
  return <CourseQueryGeneric>{children}</CourseQueryGeneric>;
});

const CourseEditorWithCollaboration = () => {
  return (
    <Collaboration>
      <CourseEditor />
    </Collaboration>
  );
};

const CourseEditor = () => {
  const { getCurrentCourseMode } = useCoursesParams();
  const mode = getCurrentCourseMode();

  //Mode => classic => authoring
  //Mode => classic => adaptive

  return (
    <>
      <AuthoringMode>
        <CourseQuery>
          <LayoutEditorUI>
            {mode === EModeEditor.adaptive ? (
              <DynamicAdapativeEditor />
            ) : (
              <DynamicAuthorEditor />
            )}
          </LayoutEditorUI>
        </CourseQuery>
      </AuthoringMode>

      <BarUI bgColor="bg-default-50" fixedInPosition="bottom" position="fixed">
        <TitlePageComponent />
        <CoursePagination />
      </BarUI>
    </>
  );
};

const Index = () => {
  const isCollaboration = useIsCollaboration("collaboration");
  return isCollaboration ? <CourseEditorWithCollaboration /> : <CourseEditor />;
};

export default Index;
