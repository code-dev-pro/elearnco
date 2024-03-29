"use client";
import { authSignup } from "lib/requests/api.request";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ERoutes } from "schemas";
import { toast } from "sonner";
import { AuthUI, LayoutUI, WallUI } from "ui";
import { SafeUser } from "schemas/auth/Auth";

//TODO - TRANSLATION
const FeatureAuthSign = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? `/${ERoutes.HOME}`;

  const signin = async (data: {
    email: string;
    password: string;
  }): Promise<void> => {
    const res = await signIn("credentials", {
      redirect: false,
      ...data,
      callbackUrl,
    });

    if (!res?.error) {
      router.push(callbackUrl);
    } else {
      toast.error(res.error);
    }
  };

  const signup = async (data: Partial<SafeUser>): Promise<void> => {
    const res = await authSignup(data);
    if (res.status === "success") {
      toast.success("An email was sent for validing credentials");
    } else {
      toast.error("Server error: try again later");
    }
  };

  const forgetPassword = () => {
    router.push(`/${ERoutes.FORGET}`);
  };

  return (
    <LayoutUI className="flex w-full">
      <WallUI className="hidden bg-foreground md:flex md:w-2/5" />
      <AuthUI
        authSignin={signin}
        authSignup={signup}
        authForgetPassword={forgetPassword}
        className="w-full md:w-3/5"
      />
    </LayoutUI>
  );
};
export default FeatureAuthSign;
