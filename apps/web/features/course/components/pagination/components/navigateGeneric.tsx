import { useCoursesParams, useIsCollaboration } from "customhooks";
import { getCourseId } from "lib/utils";
import { usePathname } from "next/navigation";
import { useRouter } from "next13-progressbar";
import React, { useEffect } from "react";
import { EModeEditor, ERoutes } from "schemas";
import { useCourseStore } from "store";
import { PaginationUI } from "ui";
import SettingsPageComponent from "./settingsPageComponent";
import AddPageComponent from "./addPageComponent";
import AddPageCompletion from "./addPageCompletion";
import NavigateBlock from "./navigateBlock";
// import ShareWithCollaboratorsComponent from "./shareWithCollaboratorsComponent";
export const PaginationGeneric = (props) => {
  const { isReadOnly = false } = props;
  const isCollaboration = useIsCollaboration("collaboration");
  // States & Hooks
  const router = useRouter();
  const pathname = usePathname();
  const courseID = getCourseId(pathname);
  const { totalPages, pages } = useCourseStore();
  const { getCurrentPage, getCurrentCourseMode } = useCoursesParams();
  const currentPage = getCurrentPage();
  const mode = getCurrentCourseMode();
  const pageValid = pages?.filter((element) => element.status === "VALID");
  const indexesValid = pageValid.map((element) => element.index);

  // Methods
  const gotoPage = (newPage: number): void => {
    const SEGMENT = isCollaboration ? ERoutes.COLLABORATION : ERoutes.EDITOR;

    if (mode === EModeEditor.adaptive) {
      router.push(`${pathname}/?page=${newPage}&mode=adaptive`);
      //   router.push(`/${SEGMENT}/${courseID}/?page=${newPage}&mode=adaptive`);
    } else {
      router.push(`${pathname}/?page=${newPage}`);
      // router.push(`/${SEGMENT}/${courseID}/?page=${newPage}`);
    }
  };

  const _gotoPage = (page: number): void => {
    gotoPage(page);
  };

  // Effects
  useEffect(() => {
    void 0;
  }, [indexesValid]);

  const testpage = totalPages === 0 ? totalPages + 1 : totalPages;

  return testpage > 0 && currentPage > 0 && currentPage < testpage + 1 ? (
    <PaginationUI
      total={testpage}
      initialPage={currentPage}
      onChange={_gotoPage}
      isValidate={indexesValid}
    >
      {!isReadOnly && (
        <>
          <AddPageComponent />
          <AddPageCompletion />
          <SettingsPageComponent />
          {/* <ShareWithCollaboratorsComponent /> */}
          <NavigateBlock />
        </>
      )}
    </PaginationUI>
  ) : (
    <></>
  );
};

export const PaginationWithCollaboration = ({
  isCollaboration,
}: {
  isCollaboration: boolean;
}) => {
  //NOTE - We remove collaboration because it's not ready yet.
  //const { doc } = useCollaboration();
  //const [block] = useYMapItem<CompleteBlock[]>(doc?.getMap("page"), "bloc");
  //const _testpage = 0; //block && block.pages ? block.pages.length : null;

  return <PaginationGeneric />;
};
