"use client";
import { Spinner } from "@nextui-org/react";
import { useUser } from "lib/providers/auth.provider";
import dynamic from "next/dynamic";
import React from "react";
import { useEffect, useState } from "react";
import { CompleteFolder, CourseType, EActionsFolder } from "schemas";
import { useDisabledStore, useFoldersStore, useTagsStore } from "store";

import { Tag } from "../../tag/types";

const DynamicAddFolderUI = dynamic(() => import("./AddFolderFormUI"), {
  loading: () => <Spinner />,
});

const DynamicAddCourseUI = dynamic(() => import("./AddCourseForm"), {
  loading: () => <Spinner />,
});

interface IProps {
  title: string;
  description: string;
  folder: CompleteFolder[];
  id?: string;
  type: CourseType;
  onClose: () => void;
  action: string;
}

export const AddCourseUI = (props: IProps) => {
  const { action } = props;
  // States & Hooks
  const [addNewFolder, setNewFolder] = useState<boolean>(false);
  const user = useUser();
  const folders = useFoldersStore((state) => state.folders);
  const { fetchDataTags, tags } = useTagsStore();
  const { onStopDisabled } = useDisabledStore();

  // Methods
  const _switchView = (): void => {
    setNewFolder((state) => !state);
  };

  const _getTagsUser = async () => await fetchDataTags(user.id);

  // Effects
  useEffect(() => {
    if (action === EActionsFolder.ADD as string) setNewFolder(true);
  }, [action]);

  useEffect(() => {
    onStopDisabled();
  }, []);

  useEffect(() => {
    if (user.id) {
      _getTagsUser();
    }
  }, [user.id]);

  return folders?.length === 0 || addNewFolder ? (
    <>
      {folders?.length === 0 ? (
        <>
          {folders?.length === 0 ? (
            <></>
          ) : (
            <span className="cursor-pointer text-tiny" onClick={_switchView}>
              Back
            </span>
          )}
          <p>
            You have no folder. Before creating a course, create a defaut folder
            name.
          </p>
        </>
      ) : (
        <>
          <span className="cursor-pointer text-tiny" onClick={_switchView}>
            Back
          </span>
          <p>Enter you name folder.</p>
        </>
      )}

      <DynamicAddFolderUI formId={action} />
    </>
  ) : (
    <DynamicAddCourseUI
      tags={[]}
      user={{
        Tag: tags as Tag[],
      }}
      {...props}
      switchView={_switchView}
    />
  );
};
export default AddCourseUI;
