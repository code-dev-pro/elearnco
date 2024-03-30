import { Button, ButtonGroup, Tooltip } from "@nextui-org/react";
import { ICON_SIZE } from "ui";
import { IconUI } from "ui/icon/IconUI";

type Props = {
  onZoomInClick: () => void;
  onZoomOutClick: () => void;
  onLockClick: () => void;
  isLockGraph: boolean;
  kindOfVue: string;
  setkindOfVue: (value: string) => void;
};
export const ToolButtons = ({
  onZoomInClick: onZoomIn,
  onZoomOutClick: onZoomOut,
  onLockClick: onLock,
  isLockGraph,
  kindOfVue,
  setkindOfVue,
}: Props) => (
  <div className="flex gap-2 items-center">
    <ButtonGroup>
      <Tooltip content="Zoom +">
        <Button size="sm" onClick={onZoomIn} isIconOnly>
          <IconUI
            name="plus"
            width={ICON_SIZE.width}
            height={ICON_SIZE.height}
          />
        </Button>
      </Tooltip>

      <Tooltip content="Zoom -">
        <Button size="sm" onClick={onZoomOut} isIconOnly>
          <IconUI
            name="minus"
            width={ICON_SIZE.width}
            height={ICON_SIZE.height}
          />
        </Button>
      </Tooltip>
      <Tooltip content={!isLockGraph ? "Lock graph" : "Unlock graph"}>
        <Button size="sm" onClick={onLock} isIconOnly>
          <IconUI
            name={isLockGraph ? "lock" : "unlock"}
            width={ICON_SIZE.width}
            height={ICON_SIZE.height}
          />
        </Button>
      </Tooltip>
    </ButtonGroup>
    <Tooltip content={!isLockGraph ? "Mode page" : "Mode block"}>
      <Button
        size="sm"
        onClick={(): void => {
          setkindOfVue(kindOfVue === "block" ? "page" : "block");
        }}
        isIconOnly
      >
        <IconUI
          name={kindOfVue === "block" ? "cards" : "simcard"}
          width={ICON_SIZE.width}
          height={ICON_SIZE.height}
        />
      </Button>
    </Tooltip>
  </div>
);
