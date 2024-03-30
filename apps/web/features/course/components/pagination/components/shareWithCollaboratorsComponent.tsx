import { Button, Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { EActionsCourse } from "schemas";
import { useGlobalModalStore } from "store/modal/useModalStore";
import { ICON_SIZE } from "ui";
import { IconUI } from "ui/icon/IconUI";

const ShareWithCollaboratorsComponent = () => {
 
  const modalStore = useGlobalModalStore();

  const _handlerClickForOpenPopover = (): void => {
    modalStore.onOpen(EActionsCourse.SHARE);
  };

  return (
    <Tooltip content="Collaborate with...">
      <Button
        radius="full"
        size="sm"
        isIconOnly
        color="primary"
        aria-label="Share"
        onClick={_handlerClickForOpenPopover}
      >
        <IconUI
          name="users"
          width={ICON_SIZE.width}
          height={ICON_SIZE.height}
        />
      </Button>
    </Tooltip>
  );
};

export default ShareWithCollaboratorsComponent;
