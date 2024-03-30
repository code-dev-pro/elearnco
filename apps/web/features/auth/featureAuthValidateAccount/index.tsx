"use client";
import { authValidate } from "lib/requests/api.request";
import { FetchResponse } from "schemas/api";
import { AuthValidationFormData } from "schemas/forms";
import { ConfirmUI, LayoutUI, WallUI } from "ui";

const FeatureAuthValidate = () => {
  const validate = async (
    data: AuthValidationFormData
  ): Promise<FetchResponse> => {
    const response = await authValidate(data);
    return response;
  };

  return (
    <LayoutUI className="flex gap-4 w-full">
      <WallUI className="hidden md:flex md:w-2/5" />
      <ConfirmUI authValidate={validate} className="w-full md:w-3/5" />
    </LayoutUI>
  );
};
export default FeatureAuthValidate;
