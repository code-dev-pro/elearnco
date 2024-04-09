"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Image, Input, Spinner, Textarea } from "@nextui-org/react";
import { useUser } from "lib/providers/auth.provider";
import { checkHttps, patternsObjects } from "lib/utils";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  CompleteFolder,
  CompleteTagCourse,
  CourseMode,
  CourseStatus,
  CourseType,
  EActionsCourse,
} from "schemas";
import { newCourseSchema, TFolder } from "schemas/courses";
import { useCoursesStore, useFoldersStore, useLoadingStore } from "store";
import * as z from "zod";

import { BACKGROUND_NO_IMAGE } from "../../const";
import { SelectUI } from "../../select/SelecUI";
import { TagUI } from "../../tag/TagUI";
import { Tag } from "../../tag/types";
import CourseTypeSelection from "./CourseTypeSelection";
function nonAll(element: any) {
  return element.name !== "All";
}
const DynamicAddFolderUI = dynamic(() => import("./AddFolderFormUI"), {
  loading: () => <Spinner />,
});

interface IProps {
  title: string;
  description: string;
  type: CourseType;
  image?: string;
  folder: CompleteFolder | CompleteFolder[];
  id?: string;
  tags: Tag[];
  onClose: () => void;
  switchView: () => void;
  action?: string;
}

type FormData = z.infer<typeof newCourseSchema>;

export const AddCourse = (props: IProps & { user: { Tag: Tag[] } }) => {
  // User
  const user = useUser();

  // Const
  const FOLDER_DEFAULT = props.folder as TFolder;
  const TITLE_DEFAULT = props?.title ?? "";
  const DESCRIPTION_DEFAULT = props?.description ?? "";
  const TAGS_SECTION_DEFAULT = props?.tags ?? [];
  const TAGS_USER_DEFAULT = props?.user?.Tag ?? [];

  // Datas
  const { id, onClose, switchView, action } = props;
  const folders = useFoldersStore((state) => state.folders);
  const courses = useCoursesStore();
  const { onBeginLoading, onStopLoading } = useLoadingStore();
  // States
  const [selected, setSelected] = useState<string>(
    props?.type ?? CourseType.CLASSIC
  );
  const [banner, setBanner] = useState<string>(props?.image ?? "Aare");

  const [currentFolder, setCurrentFolder] = useState<string>(
    FOLDER_DEFAULT?.id ?? folders?.[1]?.id ?? ""
  );

  // Refs
  // const folderIdRef = useRef<string>(
  //   FOLDER_DEFAULT?.id ?? folders?.[1]?.id ?? ""
  // );
  const imageIdRef = useRef<string>(patternsObjects[0].id);
  const tagsSection = useRef<Tag[]>(TAGS_SECTION_DEFAULT);
  const tagsUser = useRef<Tag[]>(TAGS_USER_DEFAULT);

  // Methods
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(newCourseSchema),
  });

  const _changeHandlerFolders = (value: string): void => {
    //folderIdRef.current = value;
    setCurrentFolder(value);
  };
  const _changeHandlerBanner = (value: string): void => {
    const _banner = patternsObjects.filter((pattern) => pattern.id === value);
    if (_banner.length) {
      imageIdRef.current = value;
      setBanner(_banner[0].name);
    }
  };

  const _getImageById = useMemo(() => {
    const image = patternsObjects.filter(
      (pattern) => pattern.id === imageIdRef.current
    );
    return image;
  }, [imageIdRef.current]);

  const _getImageByName = (
    name: string
  ): {
    id: string;
    name: string;
    image: string;
  }[] => {
    const image = patternsObjects.filter((pattern) => pattern.name === name);
    return image;
  };

  const _addTags = (data: { all: Tag[]; section: Tag[] }): void => {
    tagsSection.current = data?.section || [];
    tagsUser.current = data?.all || [];
  };

  const onSubmit = async (data: FormData): Promise<void> => {
    onBeginLoading();

    const image_name = checkHttps(banner)
      ? banner
      : _getImageById[0]?.name || "Aare";

    const newData = {
      ...data,
      userId: user.id,
      folderId: currentFolder,
      status: CourseStatus.DRAFT,
      type: selected as CourseType,
      mode: CourseMode.PRIVATE,
      image: image_name,
      authorId: user.author?.[0]?.id,
      tags: tagsSection.current as CompleteTagCourse[],
      tagsUser: tagsUser.current,
    };

    if (action === EActionsCourse.EDIT) {
      courses.updateCourse(id as string, newData);
    } else {
      courses.addCourse(newData);
    }
    onStopLoading();
    onClose();
  };

  const foldersWithoutAll = useMemo(()=> {
   return folders.filter(element => element.name !== 'All')},[folders]
  )

  useEffect(() => {
    const firstElement = folders.find(nonAll);
    setCurrentFolder(FOLDER_DEFAULT?.id ?? firstElement?.id ?? "");
    onStopLoading();
  }, [folders]);

  useEffect(() => {
    onStopLoading();
  }, []);

  return folders?.length <= 1 ? (
    <>
      <p>
        You have no folder. Before creating a course, create a defaut folder
        name.
      </p>
      <DynamicAddFolderUI formId={action as string} />
    </>
  ) : (
    <>
      <div
        style={{
          width: "100%",
          height: "80px",
          ...(banner ? "" : BACKGROUND_NO_IMAGE),
        }}
        className="flex justify-start items-center"
      >
        {checkHttps(banner) ? (
          <></>
        ) : (
          <div className="absolute z-20 p-2">
            <SelectUI
              data={patternsObjects}
              label=""
              placeholder="Default"
              labelPlacement="inside"
              onChange={_changeHandlerBanner}
              variant="flat"
              hasAvatar
              selectedKey={
                _getImageByName(banner)?.[0]?.id ?? patternsObjects[0].id
              }
            />
          </div>
        )}
        {banner ? (
          <Image
            removeWrapper
            alt=""
            className="z-0 w-full h-full object-cover"
            src={checkHttps(banner) ? banner : `/patterns/${banner}.svg`}
          />
        ) : (
          <></>
        )}
      </div>
      <form
        noValidate
        id={action}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Controller
          name="title"
          control={control}
          defaultValue={TITLE_DEFAULT}
          render={({ field }) => (
            <Input
              isRequired
              label="Title"
              id="title"
              aria-label="title"
              placeholder="Enter your title"
              type="text"
              description="Enter your title"
              autoCorrect="off"
              color={errors?.title ? "danger" : "default"}
              autoCapitalize="none"
              errorMessage={
                errors?.title ? (errors.title.message as unknown as string) : ""
              }
              {...field}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          defaultValue={DESCRIPTION_DEFAULT}
          render={({ field }) => (
            <Textarea
              isRequired
              label="Description"
              id="description"
              aria-label="description"
              placeholder="Enter your description"
              type="text"
              description="Enter your description"
              autoCorrect="off"
              color={errors?.description ? "danger" : "default"}
              autoCapitalize="none"
              errorMessage={
                errors?.description
                  ? (errors.description.message as unknown as string)
                  : ""
              }
              {...field}
            />
          )}
        />

        <TagUI
          section={tagsSection.current}
          all={tagsUser.current}
          callback={(data) => _addTags(data)}
        />
        <div className="flex p-2 text-sm items-center">
          <p className="mr-2">Select your course type :</p>
          <CourseTypeSelection selected={selected} onChange={setSelected} />
        </div>

        <SelectUI
          data={foldersWithoutAll}
          label="Select your folder"
          placeholder="Default"
          labelPlacement="inside"
          onChange={_changeHandlerFolders}
          selectedKey={currentFolder ?? "All"}
        />
      </form>
      <Button size="sm" className="cursor-pointer" onClick={switchView}>
        Add folder
      </Button>
    </>
  );
};
export default AddCourse;
