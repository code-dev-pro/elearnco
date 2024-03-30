"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, Button, Input, Link, Spacer } from "@nextui-org/react";
import { avartarsTotalObjects } from "lib";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { userAuthProfilSchema } from "schemas/auth/Auth";
import { UserAuthProfilSchema } from "schemas/forms";
import { useDisabledStore, useLoadingStore } from "store";

export const ProfileUI =(props: { action: string }) => {
  const { action } = props;

  

  const { data: session, update } = useSession();
  const user = session?.user;
  const { name = "", image = "", email = "" } = { ...user };
  const [currentSection, setSection] = useState<string>("profil");
  const { onBeginLoading, onStopLoading } = useLoadingStore();
  const { onStopDisabled } = useDisabledStore();
  const [currentAvatar, setAvatar] = useState<string>(image as string);

  const switchVue = (section: string): void => {
    setSection(section);
  };

  const changeAvatar = async (avatar: string): Promise<void> => {
    onBeginLoading();
    const newuser = user;
    await update({ ...newuser, user: { ...newuser, image: avatar } });
    setAvatar(avatar);
    onStopLoading();
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserAuthProfilSchema>({
    resolver: zodResolver(userAuthProfilSchema),
  });

  const onSubmit = async (data: UserAuthProfilSchema): Promise<void> => {
    onBeginLoading();
    const newuser = user;
    await update({
      ...newuser,
      user: {
        ...newuser,
        image: currentAvatar,
        name: data.name,
        email: data.email,
      },
    });

    onStopLoading();
  };

  useEffect(() => {
    onStopLoading();
    onStopDisabled();
  }, []);

  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <Avatar size="lg" isBordered src={`/avatars/${currentAvatar}.svg`} />
      {name}
      {currentSection === "profil" ? (
        <form
          noValidate
          className="flex flex-col gap-4 w-full"
          onSubmit={handleSubmit(onSubmit)}
          id={action}
        >
          <Controller
            name="name"
            control={control}
            defaultValue={name as string}
            render={({ field }) => (
              <Input
                isRequired
                label="Full Name"
                placeholder={name as string}
                type="text"
                description="Your full name"
                autoCorrect="off"
                color={errors?.name ? "danger" : "default"}
                autoCapitalize="none"
                errorMessage={
                  errors?.name ? (errors.name.message as unknown as string) : ""
                }
                {...field}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            defaultValue={email as string}
            render={({ field }) => (
              <Input
                isRequired
                label="Email"
                placeholder={email as string}
                type="email"
                description="Your email"
                autoCorrect="off"
                color={errors?.email ? "danger" : "default"}
                autoCapitalize="none"
                errorMessage={
                  errors?.email
                    ? (errors.email.message as unknown as string)
                    : ""
                }
                {...field}
              />
            )}
          />
        
          <Spacer y={1} />
          <p className="text-center text-small">
            Change your avatar ?{" "}
            <Link
              className="cursor-pointer"
              size="sm"
              onPress={(): void => switchVue("password")}
            >
              Go
            </Link>
          </p>
        </form>
      ) : (
        <div className="flex flex-col">
          <div className="flex gap-2 justify-start mb-5 mt-5">
            <Button
              onPress={(): void => switchVue("profil")}
              type="button"
              color="primary"
              variant="bordered"
              size="sm"
            >
              Back
            </Button>
          </div>
          <Spacer y={1} />
          <div className="gap-4 grid grid-cols-4 sm:grid-cols-4">
            {avartarsTotalObjects.map((item) => (
              <Avatar
                onClick={() => changeAvatar(item.image)}
                color={item.image === currentAvatar ? "primary" : "default"}
                isBordered
                draggable={false}
                key={item.name}
                src={`/avatars/${item.image}.svg`}
                className="w-16 h-16 text-large cursor-pointer"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileUI;
