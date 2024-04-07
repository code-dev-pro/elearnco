import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/react";
import { AuthService } from "lib/requests/services/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { AuthDeleteAccountFormData, ERoutes, IModal } from "schemas";
import { userAuthDeleteAccountSchema } from "schemas/auth/Auth";
import { useDisabledStore, useLoadingStore } from "store";
import { toast } from "sonner";

const DeleteAccountUI = (props: IModal) => {
  const { onStopDisabled, onBeginDisabled } = useDisabledStore();
  const { onBeginLoading, onStopLoading } = useLoadingStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") ?? `/${ERoutes.HOME}`;
  const { onClose, action, ...rest } = props;
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AuthDeleteAccountFormData>({
    resolver: zodResolver(userAuthDeleteAccountSchema),
  });

  const { user } = rest ? rest.data : { user: {} };
  const { email } = user;

  const _onValueChange = (value: string): void => {
    if (value.length > 0) {
      onStopDisabled();
    } else {
      onBeginDisabled();
    }
  };

  const onSubmit = async (): Promise<void> => {
    onBeginLoading();
    const response = await AuthService.authDeleteUser(user.id);
    // const { status} = data;

    if (response?.status === "success") {
      onStopLoading();
      reset();

      await signOut({
        redirect: false,
        callbackUrl,
      });
      onClose();
      router.push(ERoutes.SIGN);
    } else {
      onStopLoading();
      reset();

      toast.error(response as unknown as string);
    }
  };

  useEffect(() => {
    onBeginDisabled();
  }, []);

  return (
    <form noValidate id={action} onSubmit={handleSubmit(onSubmit)}>
      <p className="mb-2">
        This will delete all of the courses, and content for the account {email}
        . <br />
        Please confirm your email:
      </p>
      <Controller
        name="email"
        control={control}
        defaultValue={email}
        render={({ field }) => (
          <Input
            isRequired
            label="Email"
            readOnly
            placeholder="Enter your email"
            type="email"
            description="Enter your email to delete your account"
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
        name="confirmEmail"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Input
            isRequired
            label="Email confirmation"
            placeholder="Confirm your email"
            type="email"
            description="Confirm your email to delete your account"
            autoCorrect="off"
            color={errors?.confirmEmail ? "danger" : "default"}
            autoCapitalize="none"
            onValueChange={_onValueChange}
            errorMessage={
              errors?.confirmEmail
                ? (errors.confirmEmail.message as unknown as string)
                : ""
            }
            {...field}
          />
        )}
      />
    </form>
  );
};

export default DeleteAccountUI;
