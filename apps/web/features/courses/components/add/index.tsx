import { useCoursesParams, useHotkeys } from "customhooks";
import React, { useCallback } from "react";
import { CourseStatus } from "schemas";
import {
  EActionsCourse,
  EActionsFolder,
  EActionskeysCourse,
  EActionskeysFolder,
} from "schemas/actions";
import { useCoursesStore, useGlobalModalStore } from "store";
import { AddCardUI } from "ui";

const CourseAdd = () => {
  const { totalCourses } = useCoursesStore();

  const modalStore = useGlobalModalStore();
  const { getCurrentStatus } = useCoursesParams();
  useHotkeys([
    [EActionskeysCourse.ADD, (): void => _openModal(EActionsCourse.ADD)],
    [EActionskeysFolder.ADD, (): void => _openModal(EActionsFolder.ADD)],
  ]);

  const STATUS = getCurrentStatus();

  const _openModal = (action) => {
    modalStore.onOpen(action);
  };

  const setMessage = () => {
    if (!totalCourses || totalCourses === 0) return <p>No archived course</p>;
    return <></>;
  };

  return STATUS === (CourseStatus.ARCHIVED as string) ? (
    <>{setMessage()}</>
  ) : (
    <AddCardUI clickHandler={_openModal} />
  );
};

export default React.memo(CourseAdd);
