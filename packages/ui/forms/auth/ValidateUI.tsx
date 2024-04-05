"use client";
import { Button, Spacer } from "@nextui-org/react";
import confetti from "canvas-confetti";
import { PinInputActions, usePinInput } from "customhooks";
import { concatElementsToString } from "lib";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { FetchResponse } from "schemas";
import { AuthValidationFormData } from "schemas/forms";
import { toast } from "sonner";

interface IProps {
  authValidate?: (data: AuthValidationFormData) => Promise<FetchResponse>;
  switchVue?: (key: React.Key) => void;
}

export const ValidateUI = (props: IProps) => {
  const { authValidate } = props;
  const [isLoading, setLoading] = useState<boolean>(false);
  const [values, setValues] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<boolean>(false);
  const actionRef = React.useRef<PinInputActions>(null);
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const id = searchParams?.get("id");

  const setErrors = (): void => {
    setError(true);
    setLoading(false);
    actionRef.current?.focus();
  };
  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    if (values.includes("") /*  && id == null && token == null */) {
      setErrors();
    } else {
      const _code = concatElementsToString(values);
      const firstPart = _code.slice(0, 3);
      const secondPart = _code.slice(3);
      const transformedString = `${firstPart}-${secondPart}`;
      // authValidate?.({
      //   code: transformedString,
      //   token: token as string,
      //   id: id as string,
      // });
      setLoading(false);
      const response = await authValidate?.({
        code: transformedString,
        token: token as string,
        id: id as string,
      });

      if (response && response.status === "success") {
        confetti();
        setError(false);
        setLoading(false);
        toast.success("Great! You are now a Elearnco member");
      } else {
        toast.error(
          "Something went wrong ! Please contact team administrator."
        );
      }
    }
  };
  const { fields } = usePinInput({
    values,
    onChange: setValues,
    error,
    actionRef,
    type: "alphanumeric",
  });

  const firstHalf = fields.slice(0, Math.ceil(fields.length / 2));
  const secondHalf = fields.slice(Math.ceil(fields.length / 2));

  return (
    <form className="flex flex-col gap-4" onSubmit={(e) => onSubmit(e)}>
      <div className="flex gap-4 justify-center">
        {firstHalf.map((propsField, index) => (
          <input
            key={index}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              textAlign: "center",
            }}
            className={`pin-input__field ${
              error && "text-danger bg-danger-50"
            }`}
            {...propsField}
          />
        ))}

        <input
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            textAlign: "center",
          }}
          placeholder="-"
          className={`pin-input__field ${error && "text-danger bg-danger-50"}`}
          readOnly
        />

        {secondHalf.map((propsField, index) => (
          <input
            key={index + firstHalf.length + 1} // +1 pour éviter les clés en double
            style={{
              width: 40,
              height: 40,

              borderRadius: 10,
              textAlign: "center",
            }}
            className={`pin-input__field ${
              error && "text-danger bg-danger-50"
            }`}
            {...propsField}
          />
        ))}
      </div>
      <Spacer y={4} />
      <div className="flex gap-2 justify-center self-center w-full md:w-2/5">
        <Button isLoading={isLoading} type="submit" fullWidth color="primary">
          {isLoading ? "Loading..." : "Submit"}
        </Button>
      </div>
    </form>
  );
};
