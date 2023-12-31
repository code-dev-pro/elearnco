import { Button, Tooltip } from "@nextui-org/react";
import { useCoursesParams } from "customhooks";
import { useRouter } from "next13-progressbar";
import React from "react";
import {
  DATA_MENU_PAGES,
  EActionsCourse,
  EActionsPage,
  ERoutes,
} from "schemas";
import { useCourseStore, useGlobalModalStore } from "store";
import { DropdownUI, PaginationUI } from "ui";
import { IconUI } from "ui/icon/IconUI";

//TODO - TRANSLATION
//TODO - TESTING
//TODO - Rename _testpage because it is a tempory name for collaboration tests
//TODO - ADD OTHER ACTIONS IN THE STORE
export const PaginationGeneric = ({
  courseID,
  _testpage,
  isCollaboration,
}: {
  courseID: string;
  _testpage?: number | null;
  isCollaboration: boolean;
}) => {
  const router = useRouter();
  const modalStore = useGlobalModalStore();
  const { totalPages, addPage, deletePage, duplicatePage, updatePage } =
    useCourseStore();
  const { getCurrentPage } = useCoursesParams();
  const currentPage = getCurrentPage();

  const gotoPage = (newPage: number): void => {
    const SEGMENT = isCollaboration ? ERoutes.COLLABORATION : ERoutes.EDITOR;
    router.push(`/${SEGMENT}/${courseID}/?page=${newPage}`);
  };

  const _gotoPage = (page: number): void => {
    gotoPage(page);
  };

  const _addPage = async (): Promise<void> => {
    addPage();
    gotoPage(currentPage + 1);
  };

  const _deletePage = async (pageIndex: number): Promise<void> => {
    deletePage(pageIndex);
    gotoPage(currentPage - 1);
  };

  const _actionHandler = (action: string): void => {
    if (action === EActionsPage.DELETE) {
      if (totalPages > 1) _deletePage(currentPage);
    } else if (action === EActionsPage.DUPLICATE) {
      duplicatePage(currentPage);
    } else if (
      action === EActionsPage.PREVIEW ||
      action === EActionsPage.REORDER ||
      action === EActionsCourse.SHARE
    ) {
      modalStore.onOpen(action);
    } else if (action === EActionsPage.VALIDATE) {
      updatePage(currentPage);
    } else if (action === EActionsCourse.PREVIEW) {
      router.push(`/preview/${courseID}`);
    }
  };

  const addPageComponent = () => (
    <Tooltip content="Add page">
      <Button
        radius="full"
        size="sm"
        isIconOnly
        color="success"
        aria-label="Add"
        onClick={_addPage}
      >
        <span className="flex font-bold text-black z">+</span>
      </Button>
    </Tooltip>
  );

  const settingsPageComponent = () => {
    return (
      <DropdownUI
        showArrow={false}
        data={DATA_MENU_PAGES}
        actionHandler={_actionHandler}
        placement="bottom-end"
      >
        <div
          className="rounded-full w-8 h-8 flex bg-default items-center justify-center"
          role="button"
        >
          <IconUI name="setting" width={20} height={20} />
        </div>
      </DropdownUI>
    );
  };

  const testpage = _testpage ?? (totalPages === 0 ? totalPages + 1 : totalPages);

  return testpage > 0 && currentPage > 0 && currentPage < testpage + 1 ? (
    <PaginationUI
      total={testpage}
      activePage={currentPage}
      fixedInPosition="bottom"
      onChange={_gotoPage}
    >
      {addPageComponent()}
      {settingsPageComponent()}
    </PaginationUI>
  ) : (
    <></>
  );
};

export const PaginationWithCollaboration = ({
  courseID,
  isCollaboration,
}: {
  courseID: string;
  isCollaboration: boolean;
}) => {
  //const { doc } = useCollaboration();
  //const [block] = useYMapItem<CompleteBlock[]>(doc?.getMap("page"), "bloc");
  //const _testpage = 0; //block && block.pages ? block.pages.length : null;

  return (
    <PaginationGeneric
      isCollaboration={isCollaboration}
      courseID={courseID}
      _testpage={0}
    />
  );
};
