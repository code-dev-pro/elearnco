"use client";

import { Button } from "@nextui-org/react";
import { useDisabledStore, useLoadingStore } from "store";

//TODO: ARCHIVE IN A OTHER FOLDER

interface IProps {
  onClose: () => void;
  action: string;
  id: string;
  children?: React.ReactNode;
}

export const ModalFooterUI = (props: IProps) => {
  const { onClose, action, id, children } = props;
  const { isLoading } = useLoadingStore();
  const { isDisabled } = useDisabledStore();
  return (
    <>
      <Button color="danger" variant="light" onPress={onClose}>
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
