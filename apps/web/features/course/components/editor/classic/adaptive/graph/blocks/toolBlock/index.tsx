import { Button, ButtonGroup, Tooltip } from "@nextui-org/react";
import { ICON_SIZE } from "ui";
import Comments from "ui/comments";
import { IconUI } from "ui/icon/IconUI";

export const ToolBlock = (props) => {
  
  const {showBlock, id, uuid} = props
  
 return <ButtonGroup>
   
    <Tooltip content="Show blocks">
      <Button variant="flat" onClick={showBlock} size="sm" isIconOnly>
        <IconUI
          name="cards"
          width={ICON_SIZE.width}
          height={ICON_SIZE.height}
        />
      </Button>
    </Tooltip>
    <Tooltip content="Validate page">
      <Button variant="flat" size="sm" isIconOnly>
        <IconUI
          name="check"
          width={ICON_SIZE.width}
          height={ICON_SIZE.height}
        />
      </Button>
    </Tooltip>
    <Tooltip content="Delete page">
      <Button variant="flat" size="sm" isIconOnly>
        <IconUI
          name="delete"
          width={ICON_SIZE.width}
          height={ICON_SIZE.height}
        />
      </Button>
    </Tooltip>
    <Comments isRounded={false} id={id} uuid={uuid} />
  </ButtonGroup>
}
