import React, { useRouter } from "next/navigation";

import ButtonUI from "../../button/ButtonUI";
import { ICON_SIZE } from "../../const";

const ButtonBack = () => {
  const router = useRouter();

  const _handleClick = (): void => {
    router.back();
  };

  return (
    <ButtonUI
      tooltip={{
        content: "Back",
        placement: "bottom",
      }}
      button={{
        withTooltip: true,
        handleClick: _handleClick,
        isIconOnly: true,
        label: "Back",
        className: "rounded-full",
      }}
      icon={{ iconSize: ICON_SIZE.width, iconName: "back" }}
    />
  );
};

export default ButtonBack;
