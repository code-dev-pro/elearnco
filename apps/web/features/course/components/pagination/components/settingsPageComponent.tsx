"use client";
import { DropdownUI } from "ui";
import { IconUI } from "ui/icon/IconUI";
import { ICON_SIZE } from "ui/const";
import { useRouter } from "next13-progressbar";
import { getCourseId } from "lib/utils";
import { EActionsCourse, EActionsPage, EColor, ERoutes } from "schemas";
import { useCourseStore, useGlobalModalStore } from "store";
import { useCoursesParams, useIsCollaboration } from "customhooks";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const DATA_MENU_PAGES_SECTION_2 = [
  {
    id: "ea204064-821f-11ee-b962-0242ac120002",
    label: "Preview",
    shortcut: { name: "", action: "" },
    description: "",
    startContent: "preview",
    action: EActionsCourse.PREVIEW,
    color: EColor.default,
    isdisabled: "false",
    isvisible: "true",
    route: "",
  },

  {
    id: "63ad7b18-8211-11ee-b962-0242ac120002",
    label: "Share",
    shortcut: { name: "", action: "" },
    description: "",
    startContent: "share",
    action: EActionsCourse.SHARE,
    color: EColor.default,
    isdisabled: "false",
    isvisible: "true",
    route: "",
  },
  {
    id: "cbba7db6-82be-11ee-b962-0242ac120002",
    label: "Preview path",
    shortcut: { name: "", action: "" },
    description: "",
    startContent: "share",
    action: EActionsCourse.PATH,
    color: EColor.default,
    isdisabled: "false",
    isvisible: "true",
    route: "",
  },
];
const SettingsPageComponent = () => {
  // Hooks & States
  const modalStore = useGlobalModalStore();
  const isCollaboration = useIsCollaboration("collaboration");
  const router = useRouter();
  const pathname = usePathname();
  const courseID = getCourseId(pathname);
  const { totalPages, deletePage, duplicatePage, updatePage, pages } =
    useCourseStore();
  const { getCurrentPage } = useCoursesParams();
  const currentPage = getCurrentPage();

  const DATA_MENU_PAGES_SECTION_1 = useMemo(
    () => [
      {
        id: "49b15a2c-da97-4a5d-bedc-a33ae64e2588",
        label: "Preview",
        shortcut: { name: "", action: "" },
        description: "",
        startContent: "preview",
        action: EActionsPage.PREVIEW,
        color: EColor.default,
        isdisabled: "false",
        isvisible: "true",
        route: "",
      },
      {
        id: "19e58ff2-8211-11ee-b962-0242ac120002",
        label: "Duplicate",
        shortcut: { name: "", action: "" },
        description: "",
        startContent: "duplicate",
        action: EActionsPage.DUPLICATE,
        color: EColor.default,
        isdisabled: "false",
        isvisible: "true",
        route: "",
      },
      {
        id: "1e815460-8211-11ee-b962-0242ac120002",
        label:
          pages[currentPage - 1]?.status === "VALID"
            ? "Cancel Validate"
            : "Validate",
        shortcut: { name: "", action: "" },
        description: "",
        startContent: "checkbadge",
        action:
          pages[currentPage - 1]?.status === "VALID"
            ? "Cancel Validate"
            : EActionsPage.VALIDATE,
        color: EColor.default,
        isdisabled: "false",
        isvisible: "true",
        route: "",
      },
      {
        id: "ea204064-821f-11ee-b962-0242ac120009",
        label: "Reorder",
        shortcut: { name: "", action: "" },
        description: "",
        startContent: "scrollist",
        action: EActionsPage.REORDER,
        color: EColor.default,
        isdisabled: "false",
        isvisible: "true",
        route: "",
      },
      {
        id: "22c55c7e-8211-11ee-b962-0242ac120006",
        label: "Delete",
        shortcut: { name: "", action: "" },
        description: "",
        startContent: "delete",
        action: EActionsPage.DELETE,
        color: EColor.default,
        isdisabled: currentPage === 1 ? "true" : "false",
        isvisible: "true",
        route: "",
      },
    ],
    [currentPage]
  );

  const DATA_MENU_PAGES = useMemo(
    () => [
      {
        data: DATA_MENU_PAGES_SECTION_1,
        title: "Page",
        id: "b01c74ce-820f-11ee-b962-0242ac120007",
      },
      {
        data: DATA_MENU_PAGES_SECTION_2,
        title: "Course",
        id: "b5bc9d50-820f-11ee-b962-0242ac120082",
      },
    ],
    [currentPage]
  );

  // Methods
  const gotoPage = (newPage: number): void => {
    const SEGMENT = isCollaboration ? ERoutes.COLLABORATION : ERoutes.EDITOR;
    router.push(`/${SEGMENT}/${courseID}/?page=${newPage}`);
  };

  const _deletePage = async (pageIndex: number): Promise<void> => {
    if (pageIndex === 1) return;
    await deletePage(courseID, pageIndex);
    gotoPage(currentPage - 1);
  };

  const _actionHandler = async (action: string): Promise<void> => {
    if (action === EActionsPage.DELETE) {
      if (totalPages > 1) _deletePage(currentPage);
    } else if (action === EActionsPage.DUPLICATE) {
      if (currentPage !== 1) {
        duplicatePage(currentPage, currentPage + 1);
      }
    } else if (
      action === EActionsPage.REORDER ||
      action === EActionsCourse.SHARE
    ) {
      modalStore.onOpen(action);
    } else if (action === EActionsCourse.PATH) {
      const SEGMENT = isCollaboration ? ERoutes.EDITOR+"/"+ERoutes.COLLABORATION : ERoutes.EDITOR;
      router.push(`/${SEGMENT}/${courseID}/?page=${currentPage}&mode=adaptive`);
    } else if (action === EActionsPage.VALIDATE) {
      updatePage(currentPage, {
        status: "VALID",
        cover: "",
      });
    } else if (action === "Cancel Validate") {
      updatePage(currentPage, {
        status: "DRAFT",
      });
    } else if (action === EActionsCourse.PREVIEW) {
      router.push(`/${ERoutes.PREVIEW}/${courseID}`);
    } else if (action === EActionsPage.PREVIEW) {
      router.push(`/${ERoutes.PREVIEW}/${courseID}/?page=${currentPage}`);
    }
  };

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
        <IconUI
          name="setting"
          width={ICON_SIZE.width}
          height={ICON_SIZE.height}
        />
      </div>
    </DropdownUI>
  );
};
export default SettingsPageComponent;
