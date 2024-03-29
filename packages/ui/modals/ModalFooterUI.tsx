"use client";
import { Button } from "@nextui-org/react";
import React from "react";
import { useDisabledStore, useLoadingStore } from "store";

//TODO: ARCHIVE IN A OTHER FOLDER

interface IProps {
  action: string;
  onClose: () => void;
}

export const ModalFooterUI = (props: IProps) => {
  const { action, onClose } = props;
  const { isLoading } = useLoadingStore();
  const { isDisabled } = useDisabledStore();



  return (
    <>
      <Button color="danger" variant="flat" onPress={onClose}>
        Close
      </Button>

      <Button
        isDisabled={isDisabled}
        isLoading={isLoading}
        type="submit"
        color="primary"
        form={action}
      >
        {isLoading ? "Loading..." : "Valid"}
      </Button>
    </>
  );
};

export default ModalFooterUI;
