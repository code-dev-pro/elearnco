"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, Input, Spacer } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { userAuthPreregisterSchema } from "schemas/auth/Auth";
import { AuthForgetFormData } from "schemas/forms";
import { useLoadingStore } from "store/loading";

import { LogoSymbolUI } from "../../logo";

interface IProps {
  authForget?: (data: AuthForgetFormData) => Promise<void>;
  className?: string;
}

export const ForgetUI = (props: IProps) => {
  const { authForget, className } = props;
  const { isLoading, onStopLoading, onBeginLoading } = useLoadingStore();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AuthForgetFormData>({
    resolver: zodResolver(userAuthPreregisterSchema),
  });
  const t = useTranslations("auth");
  const onSubmit = async (data: AuthForgetFormData): Promise<void> => {
    onBeginLoading();
    authForget?.(data);
    onStopLoading();
    reset();
  };

  const getSmiley = useCallback(() => {
    return <>🧠 </>;
  }, []);

  const TITLE = t("resetpassword.title");

  useEffect(() => {
    onStopLoading();
  }, []);

  return (
    <div className={`flex flex-col ${className}`}>
      <Card
        radius="none"
        className="h-full w-full items-center rounded-none sm:rounded-s-3xl"
      >
        <CardBody className="overflow-hidden w-full max-w-2xl">
          <div className="w-full flex justify-center">
            <LogoSymbolUI color="currentColor" width={70} height={70} />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight py-4 text-center">
            {getSmiley()}
            {TITLE}
          </h1>
          <Spacer y={4} />
          <form
            noValidate
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  isRequired
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  description="Enter your email to reset you password"
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

            <Spacer y={4} />

            <div className="flex gap-2 justify-center self-center w-full md:w-2/5">
              <Button
                isLoading={isLoading}
                type="submit"
                fullWidth
                color="primary"
              >
                {isLoading ? "Loading..." : "Reset password"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
