"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/react";
import { useUser } from "lib/providers/auth.provider";
import { createFolderFromApi } from "lib/requests/folder/folder";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FolderSchema } from "schemas/folder";
import { useFoldersStore } from "store";
import { useDisabledStore } from "store/disabled/useDisabledStore";
import { useLoadingStore } from "store/loading/useLoadingStore";
import * as z from "zod";

//We need data folder if exist else default folder name is default
type FormData = z.infer<typeof FolderSchema>;
const AddFolderFormUI = ({ formId }: { formId: string }) => {
  const user = useUser();
  const { addFolder, totalFolders } = useFoldersStore();
  const { onBeginLoading, onStopLoading } = useLoadingStore();
  const { onStopDisabled } = useDisabledStore();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FolderSchema),
  });

  const onSubmit = async (data: FormData): Promise<void> => {
    onBeginLoading();
    const folder = await createFolderFromApi({
      name: data.title,
      userId: user.id,
    });
    if (totalFolders === 0) {
      useFoldersStore.getState().fetchDataFolders();
    } else {
      if (folder) addFolder(folder);
    }

    onStopLoading();
    reset();
  };

  useEffect(() => {
    onStopDisabled();
  }, []);

  return (
    <form
      noValidate
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Controller
        name="title"
        control={control}
        defaultValue=""
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
    </form>
  );
};
export default AddFolderFormUI;
