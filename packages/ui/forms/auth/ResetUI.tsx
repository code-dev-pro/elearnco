"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, Input, Spacer } from "@nextui-org/react";
import { clean } from "lib/utils";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { userAuthResetSchema } from "schemas/auth/Auth";
import { AuthResetFormData } from "schemas/forms";
import { useLoadingStore } from "store/loading";

import { LogoSymbolUI } from "../../logo";

interface IProps {
  authReset?: (
    data: Omit<AuthResetFormData, "confirmPassword"> & { token: string }
  ) => Promise<void>;
  className?: string;
}

export const ResetUI = (props: IProps) => {
  const { authReset, className } = props;
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const { isLoading, onStopLoading, onBeginLoading } = useLoadingStore();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AuthResetFormData>({
    resolver: zodResolver(userAuthResetSchema),
  });
  const t = useTranslations("auth");

  const getSmiley = useCallback(() => {
    return <>👋 </>;
  }, []);
  const onSubmit = async (data: AuthResetFormData): Promise<void> => {
    const { confirmPassword = "", ...rest } = data;
    if (token && clean(token) !== "") {
      onBeginLoading();
      authReset?.({ ...rest, token });
      onStopLoading();
      reset();
    }
  };
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
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  isRequired
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  description="Enter your password to create your account"
                  color={errors?.password ? "danger" : "default"}
                  errorMessage={
                    errors?.password
                      ? (errors.password.message as unknown as string)
                      : ""
                  }
                  {...field}
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  isRequired
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  type="password"
                  description="Enter your password to create your account"
                  color={errors?.confirmPassword ? "danger" : "default"}
                  errorMessage={
                    errors?.confirmPassword
                      ? (errors.confirmPassword.message as unknown as string)
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
