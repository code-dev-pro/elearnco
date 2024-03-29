"use client";
import { Spinner } from "@nextui-org/react";
import dynamic from "next/dynamic";
import React, { useCallback } from "react";
import {
  EActionsCourse,
  EActionsCourseInDrop,
  EActionsFolder,
  EActionsMedia,
  EActionsMenuShortcuts,
  EActionsPage,
  EActionsUser,
} from "schemas";
import { useGlobalModalStore } from "store";
import { ModalFooterUI } from "ui";
import { Ebackdrop, EPlacement, GlobalModalUI } from "ui/modals/GlobalModalUI";

const DynamicReorder = dynamic(
  () => import("../features/course/components/reorder"),
  {
    loading: () => <Spinner />,
  }
);

const DynamicProfil = dynamic(() => import("ui/forms/auth/ProfilUI"), {
  loading: () => <Spinner />,
});

const DynamicFeatures = dynamic(() => import("../features/features"), {
  loading: () => <Spinner />,
});

const DynamicTips = dynamic(() => import("./tips"), {
  loading: () => <Spinner />,
});

const DynamicHelp = dynamic(() => import("ui/help/HelpUI"), {
  loading: () => <Spinner />,
});

const DynamicShareWith = dynamic(() => import("../features/share"), {
  loading: () => <Spinner />,
});

const DynamicAddCourse = dynamic(() => import("ui/forms/course/AddCourseUI"), {
  loading: () => <Spinner />,
});

const DynamicAUserActions = dynamic(() => import("ui/course/CourseActionsUI"), {
  loading: () => <Spinner />,
});

const DynamicSettings = dynamic(() => import("ui/settings/SettingsUI"), {
  loading: () => <Spinner />,
});

const DynamicToolEditImage = dynamic(
  () => import("lib/tools/images/editor/ImageEditor"),
  {
    loading: () => <Spinner />,
    ssr: true,
  }
);

const DynamicMediaFomService = dynamic(
  () => import("ui/media/fromservice/LibraryUI"),
  {
    loading: () => <Spinner />,
  }
);
export const ParentModalUI = () => {
  const { isOpen, onClose, action, data } = useGlobalModalStore();

  const getBody = useCallback(() => {
    //TOOLS
    if (action === "Edit image") {
      return (
        <DynamicToolEditImage onClose={onClose} action={action} {...data} />
      );
    }
    // USER
    if (action === (EActionsUser.EDIT_PROFIL as string)) {
      return <DynamicProfil action={action} />;
    }
    // COURSE
    if (action === (EActionsCourse.SHARE as string)) {
      return <DynamicShareWith />;
    }
    if (
      action === (EActionsCourse.ADD as string) ||
      action === EActionsCourse.EDIT as string||
      action === EActionsFolder.ADD as string
    ) {
      return <DynamicAddCourse action={action} onClose={onClose} {...data} />;
    }

    if (
      action === (EActionsUser.DELETE as string) ||
      action === (EActionsCourseInDrop.ARCHIVE as string) ||
      action === (EActionsCourseInDrop.DELETE as string) ||
      action === (EActionsCourseInDrop.DUPLICATE as string) ||
      action === (EActionsCourse.UNARCHIVE as string)
    ) {
      return (
        <DynamicAUserActions onClose={onClose} action={action} {...data} />
      );
    }

    if (action === (EActionsPage.REORDER as string)) {
      return <DynamicReorder />;
    }

    // TIPS
    if (action === EActionsMenuShortcuts.TIPS) {
      return <DynamicTips onClose={onClose} />;
    }
    // FEATURES
    if (action === EActionsMenuShortcuts.FEATURES) {
      return <DynamicFeatures />;
    }
    // HELP
    if (action === (EActionsUser.HELP as string)) {
      return <DynamicHelp />;
    }
    //SETTINGS
    if (action === (EActionsUser.SETTINGS as string)) {
      return <DynamicSettings />;
    }
    // MEDIAS
    if (action === (EActionsMedia.ADD_FROM_SERVICE as string)) {
      return (
        <DynamicMediaFomService
          onClose={onClose}
          action={EActionsMedia.UPDATE_IMAGE_BANNER as string}
        />
      );
    }
    if (action === (EActionsMedia.ADD_FROM_LIBRARY as string)) {
      return <>{action}</>;
    }
    if (action === (EActionsMedia.ADD_FROM_USER as string)) {
      return <>{action}</>;
    }
    return <></>;
  }, [action, data, onClose]);

  const getFooter = useCallback(() => {
    if (
      action === EActionsMenuShortcuts.TIPS ||
      action === EActionsMenuShortcuts.FEATURES ||
      action === EActionsUser.HELP as string ||
      action === EActionsUser.SETTINGS as string
    ) {
      return null;
    }

    if (action === "Edit image") {
      return <></>;
    }
    return (
      <ModalFooterUI {...data} isInForm action={action} onClose={onClose} />
    );
  }, [action, data, onClose]);

  const getClassNames = useCallback((): string => {
    if (action === (EActionsMedia.ADD_FROM_SERVICE as string)) {
      return "py-0";
    }
    return "";
  }, [action]);

  const getSize = useCallback(() => {
    if (
      action === (EActionsMedia.ADD_FROM_SERVICE as string) ||
      action === "Edit image"
    ) {
      return "3xl";
    }
    if (action === (EActionsCourse.SHARE as string)) {
      return "2xl";
    }
    if (
      action === (EActionsPage.PREVIEW as string) ||
      action === (EActionsPage.REORDER as string)
    ) {
      return "full";
    }
    return "md";
  }, [action]);

  return (
    <GlobalModalUI
      isDismissable
      isOpen={isOpen}
      placement={EPlacement.AUTO}
      Body={<>{getBody()}</>}
      Footer={<>{getFooter()}</>}
      title={action}
      backdrop={Ebackdrop.BLUR}
      onOpenChange={onClose}
      size={getSize()}
      classNames={`no-scrollbar ${getClassNames()}`}
    />
  );
};
