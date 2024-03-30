import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Link, Spacer } from "@nextui-org/react";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { userAuthSignupSchema } from "schemas/auth/Auth";
import { UserAuthSignupSchema } from "schemas/forms";
import { useLoadingStore } from "store/loading";



interface IProps {
  authSignup?: (data: UserAuthSignupSchema) => Promise<void>;
  switchVue?: (key: React.Key) => void;
}

export const SignupUI = (props: IProps) => {
  const { authSignup, switchVue } = props;
  const { isLoading, onStopLoading, onBeginLoading } = useLoadingStore();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserAuthSignupSchema>({
    resolver: zodResolver(userAuthSignupSchema),
  });

  const onSubmit = async (data: UserAuthSignupSchema): Promise<void> => {
    onBeginLoading();
    authSignup?.(data);
    onStopLoading();
    reset();
  };
  useEffect(() => {
    onStopLoading();
  }, []);

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="name"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Input
            isRequired
            label="Full Name"
            placeholder="Enter your full name"
            type="text"
            description="Enter your name to create your account"
            autoCorrect="off"
            autoCapitalize="none"
            color={errors?.name ? "danger" : "default"}
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
        defaultValue=""
        render={({ field }) => (
          <Input
            isRequired
            label="Email"
            placeholder="Enter your email"
            type="email"
            description="Enter your email to create to your account"
            autoCorrect="off"
            color={errors?.email ? "danger" : "default"}
            autoCapitalize="none"
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
      <p className="text-center text-small">
        Already have an account?{" "}
        <Link size="sm" onPress={() => switchVue?.("login")}>
          Login
        </Link>
      </p>
      <div className="flex gap-2 justify-center self-center w-full md:w-2/5">
        <Button isLoading={isLoading} type="submit" fullWidth color="primary">
          {isLoading ? "Loading..." : "Sign Up"}
        </Button>
      </div>
    </form>
  );
};
