"use client";
import { Button } from "@nextui-org/react";
import { authResetPassword } from "lib/requests/api.request";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { ErrorResponse } from "resend";
import { ERoutes } from "schemas";
import { toast } from "sonner";
import { LayoutUI, ResetUI, WallUI } from "ui";
const FeatureAuthReset = () => {
  const [isNewLink, setNewLink] = useState<boolean>(false);
  const router = useRouter();
  const _authReset = async (data: {
    password: string;
    token: string;
  }): Promise<void> => {
    const res = await authResetPassword(data);

    if (res.status === "success") {
      toast.success("Reset password successfully");
    } else {
      const error = res.data as ErrorResponse;
      toast.error(
        error.message ? error.message : "Server error: try again later"
      );

      if (error.message.includes("expired")) {
        setNewLink(true);
      }
    }
  };

  const _gotoForgot = (): void => {
    router.push(`${ERoutes.FORGET}`);
  };

  return (
    <LayoutUI className="flex w-full">
      <WallUI className="hidden bg-foreground md:flex md:w-2/5" />
      {isNewLink ? (
        <div className="flex w-full h-full justify-center items-center md:w-3/5">
          <div className="flex justify-center items-center self-center w-full md:w-3/5">
            <Button
              onClick={_gotoForgot}
              type="button"
              className="ml-4 mr-4"
              fullWidth
              color="primary"
            >
              "Send me a new link"
            </Button>
          </div>
        </div>
      ) : (
        <Suspense>
          <ResetUI
            authReset={_authReset}
            className="w-full md:w-3/5 bg-foreground"
          />
        </Suspense>
      )}
    </LayoutUI>
  );
};

export default FeatureAuthReset;
