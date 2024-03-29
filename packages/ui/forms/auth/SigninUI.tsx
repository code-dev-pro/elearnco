import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Link, Spacer } from "@nextui-org/react";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { userAuthSigninSchema } from "schemas/auth/Auth";
import { useLoadingStore } from "store";
import * as z from "zod";

type FormData = z.infer<typeof userAuthSigninSchema>;

interface IProps {
  authSignin?: (data: FormData) => void;
  switchVue?: (key: React.Key) => void;
  authForgetPassword?: () => void;
}

export const SigninUI = (props: IProps) => {
  const { authSignin, switchVue, authForgetPassword } = props;
  const { isLoading, onStopLoading } = useLoadingStore();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSigninSchema),
  });

  const onSubmit = async (data: FormData): Promise<void> => {
    authSignin?.(data);
    reset();
  };

  useEffect(() => {
    onStopLoading();
  }, []);

  return (
    <form
      noValidate
      className="flex flex-col gap-4 "
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
            description="Enter your email to sign in to your account"
            autoCorrect="off"
            color={errors?.email ? "danger" : "default"}
            autoCapitalize="none"
            autoComplete="current-email"
            errorMessage={
              errors?.email ? (errors.email.message as unknown as string) : ""
            }
            {...field}
          />
        )}
      />
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
            autoComplete="current-password"
            description="Enter your password to sign in to your account"
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
      <Spacer y={4} />
      <p className="text-center text-small">
        Need to create an account?{" "}
        <Link
          className="cursor-pointer"
          size="sm"
          onPress={(): void => switchVue?.("sign-up")}
        >
          Sign up
        </Link>
      </p>
      <p className="text-center text-small">Or</p>

      <p className="text-center text-small">
        Forgot password?{" "}
        <Link
          className="cursor-pointer"
          size="sm"
          onPress={(): void => authForgetPassword?.()}
        >
          Click here
        </Link>
      </p>
      <Spacer y={4} />
      <div className="flex gap-2 justify-center self-center w-full md:w-2/5">
        <Button isLoading={isLoading} type="submit" fullWidth color="primary">
          {isLoading ? "Loading..." : "Login"}
        </Button>
      </div>
    </form>
  );
};
