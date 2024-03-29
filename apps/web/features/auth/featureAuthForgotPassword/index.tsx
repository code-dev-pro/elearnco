"use client";
import { authForgetPassword } from "lib/requests/api.request";
import { toast } from "sonner";
import { ForgetUI, LayoutUI, WallUI } from "ui";
const FeatureAuthForgot = () => {
  const _authForget = async (data) => {
    const res = await authForgetPassword(data);
    if (res.status === "success") {
      toast.success("An email was sent for changing your password");
    } else {
      toast.error("Server error: try again later");
    }
  };

  return (
    <LayoutUI className="flex w-full">
      <WallUI className="hidden bg-foreground md:flex md:w-2/5" />
      <ForgetUI
        authForget={_authForget}
        className="w-full md:w-3/5 bg-foreground"
      />
    </LayoutUI>
  );
};

export default FeatureAuthForgot;
