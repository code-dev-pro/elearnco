import { GridItemInterface } from "schemas/dashboard";
import { CardDashboardUI } from "ui/card/CardDashboardUI";
import { Button } from "@nextui-org/react";
import { useCallback } from "react";
import { EActionsMenuShortcuts } from "schemas";
import { useGlobalModalStore } from "store";
import { LogoSymbolUI } from "ui";

const HeaderChildren = () => {
  const modalStore = useGlobalModalStore();
  const openModal = useCallback(
    () => modalStore.onOpen(EActionsMenuShortcuts.FEATURES),
    []
  );

  return (
    <div className="flex justify-between w-full">
      <div className="bg-black rounded-lg w-14 h-14 flex justify-center items-center">
        <LogoSymbolUI color="white" width={40} height={40} />
      </div>
      <Button color="primary" radius="full" size="sm" onPress={openModal}>
        See all features
      </Button>
    </div>
  );
};
const BodyChildren = (props: GridItemInterface) => {
  const { title, description = "" } = props;

  return (
    <div className="flex flex-col mt-2">
      <p className="text-md">{title}</p>
      <p className="text-small text-default-500 line-clamp-2">{description}</p>
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
