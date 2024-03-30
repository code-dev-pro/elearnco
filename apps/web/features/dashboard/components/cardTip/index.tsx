import { Button } from "@nextui-org/react";
import { useHotkeys } from "customhooks/use-hotkeys/use-hotkeys";
import { useCallback } from "react";
import { EActionsMenuShortcuts } from "schemas";
import { GridItemInterface } from "schemas/dashboard";
import { useGlobalModalStore } from "store";
import { ICON_SIZE } from "ui";
import { CardDashboardUI } from "ui/card/CardDashboardUI";
import { IconUI } from "ui/icon/IconUI";

const HeaderChildren = () => {
  const modalStore = useGlobalModalStore();

  const openModal = useCallback(
    () => modalStore.onOpen(EActionsMenuShortcuts.TIPS),
    []
  );

  useHotkeys([["mod+K", (): void => openModal()]]);

  return (
    <div className="flex justify-between w-full">
      <div className="bg-black rounded-lg w-14 h-14 flex justify-center items-center">
        <IconUI
          width={ICON_SIZE.width * 2}
          height={ICON_SIZE.height * 2}
          name="help"
        ></IconUI>
      </div>
      <Button color="primary" radius="full" size="sm" onPress={openModal}>
        Open
      </Button>
    </div>
  );
};

const BodyChildren = (props: GridItemInterface) => {
  const { title, description = "" } = props;

  return (
    <div className="flex flex-col mt-2">
      <p className="text-md">{title}</p>
      <p className="text-small text-default-500">{description}</p>
    </div>
  );
};

const CardLastNew = (props: GridItemInterface) => {
  return (
    <CardDashboardUI
      headerChildren={<HeaderChildren />}
      bodyChildren={<BodyChildren {...props} />}
    />
  );
};

export default CardLastNew;
