"use client";
import { Folder } from "database";
import React, { FormEvent, useEffect } from "react";
import {
  CompleteCourse,
  CourseStatus,
  EActionsCourse,
  EActionsCourseInDrop,
  EActionsUser,
  IModal,
} from "schemas";
import { useCoursesStore, useDisabledStore } from "store";

import DeleteAccountUI from "../forms/auth/DeleteAccountUI";
const MessageToArchiveCourse = (props: IModal) => {
  const courses = useCoursesStore();
  const { onStopDisabled, onBeginDisabled } = useDisabledStore();
  const { onClose, action, ...rest } = props;
  const { id, title } = rest as Partial<CompleteCourse>;

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    courses.updateCourse(id as string, { status: CourseStatus.ARCHIVED });
    onBeginDisabled();
    onClose();
  };

  useEffect(() => {
    onStopDisabled();
  }, []);

  return (
    <form noValidate id={action} onSubmit={onSubmit}>
      <p>You would like to archive this course :</p>
      <div>
        <p className="bg-default-100 p-2 rounded-small mb-2 mt-2">{title}</p>
      </div>
      <p>
        This content will no longer be accessible and you can unarchive it at
        any time to make it available.
      </p>
    </form>
  );
};

const MessageToUnArchiveCourse = (props: IModal) => {
  const courses = useCoursesStore();
  const { onStopDisabled, onBeginDisabled } = useDisabledStore();
  const { onClose, action, ...rest } = props;
  const { id, title } = rest as Partial<CompleteCourse>;
  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    courses.updateCourse(id as string, { status: CourseStatus.DRAFT });
    onBeginDisabled();
    onClose();
  };

  useEffect(() => {
    onStopDisabled();
  }, []);

  return (
    <form noValidate id={action} onSubmit={onSubmit}>
      <p>You would like to unarchive this course :</p>
      <div>
        <p className="bg-default-100 p-2 rounded-small mb-2 mt-2">{title}</p>
      </div>
      <p>
        This content will no longer be accessible and you can unarchive it at
        any time to make it available.
      </p>
    </form>
  );
};

const MessageToDeleteCourse = (props: IModal) => {
  const courses = useCoursesStore();
  const { onClose, action, ...rest } = props;
  const { id, title } = rest as Partial<CompleteCourse>;

  const { onStopDisabled, onBeginDisabled } = useDisabledStore();

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    courses.deleteCourse(id as string);
    onBeginDisabled();
    onClose();
  };

  useEffect(() => {
    onStopDisabled();
  }, []);

  return (
    <form noValidate id={action} onSubmit={onSubmit}>
      <p>You would like to delete this course :</p>
      <div>
        <p className="bg-default-100 p-2 rounded-small mb-2 mt-2">{title}</p>
      </div>
      <p>This content will no longer be accessible !</p>
    </form>
  );
};

const MessageToDuplicateCourse = (props: IModal) => {
  const courses = useCoursesStore();
  const { onStopDisabled, onBeginDisabled } = useDisabledStore();
  const { onClose, action, ...rest } = props;
  const { id, title } = rest as Partial<CompleteCourse>;
  const _id = id;

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const data = courses.courses.find((c) => c.id === _id);
    const { id, folder, updatedAt, createdAt, author, ...rest } =
      data as unknown as CompleteCourse & Folder;
    courses.addCourse(rest);
    onBeginDisabled();
    onClose();
  };

  useEffect(() => {
    onStopDisabled();
  }, []);

  return (
    <form noValidate id={action} onSubmit={onSubmit}>
      <p>You would like to duplicate this course :</p>
      <div>
        <p className="bg-default-100 p-2 rounded-small mb-2 mt-2">{title}</p>
      </div>
      <p>This course will be duplicate in the same folder.</p>
    </form>
  );
};
const MessageToDeleteUser = (props: IModal) => {

 return <DeleteAccountUI {...props}/>
 
};
const CourseActionsUI = (props: IModal) => {
  const { action, onClose, ...rest } = props;

  const getComponentByAction = (action: string) => {
    switch (action) {
      case EActionsCourse.UNARCHIVE:
        return (
          <MessageToUnArchiveCourse
            onClose={onClose}
            action={action}
            {...rest}
          />
        );
      case EActionsCourseInDrop.DELETE:
        return (
          <MessageToDeleteCourse onClose={onClose} action={action} {...rest} />
        );
      case EActionsUser.DELETE:
        return (
          <MessageToDeleteUser onClose={onClose} action={action} {...rest} />
        );
      case EActionsCourseInDrop.DUPLICATE:
        return (
          <MessageToDuplicateCourse
            onClose={onClose}
            action={action}
            {...rest}
          />
        );
      default:
        return (
          <MessageToArchiveCourse onClose={onClose} action={action} {...rest} />
        );
    }
  };

  return getComponentByAction(action);
};

export default CourseActionsUI;
