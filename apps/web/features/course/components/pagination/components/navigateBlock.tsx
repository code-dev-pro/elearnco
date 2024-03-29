import { usePageStore } from "store";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { IconUI } from "ui/icon/IconUI";
import { ICON_SIZE } from "ui";
import { useState } from "react";
import {
  capitalizeFirstLetterOfEachWord,
  getBlockColor,
  removeHTMLTagsAndQuotes,
} from "lib/utils";
import { ActivityBlockType, MediaBlockType } from "schemas";
const NavigateBlock = () => {
  const { blocks, setActiveBlock } = usePageStore();

  const [selectedKeys, setSelectedKeys] = useState<React.Key>("");

  const scrollToBlock = (element: string): void => {
    let item = document.getElementById(element); // what we want to scroll to
    let wrapper = document.getElementById("scrolling_ref"); // the wrapper we will scroll inside
    if (item && wrapper) {
      let count = item.offsetTop - wrapper.scrollTop - 80; // xx = any extra distance from top ex. 60
      wrapper.scrollBy({ top: count, left: 0, behavior: "smooth" });
    }
  };

  const _actionHandler = (e: React.MouseEvent, uuid: string): void => {
    e.stopPropagation();
    e.preventDefault();
    setActiveBlock(uuid);
    scrollToBlock(uuid);
  };

  const _getContent = (block) => {
    return block?.content?.[0]?.content?.content ? (
      <p className="truncate mr-2 hover:text-clip">
        {block.type === MediaBlockType.IMAGE
          ? block.content[0].content.title
          : block.type === ActivityBlockType.WHEEL
          ? "Wheel"
          : block.type === ActivityBlockType.MULTIPLE_CHOICE
          ? "QCM"
          : block.type === MediaBlockType.VIDEO
          ? "Vidéo"
          : removeHTMLTagsAndQuotes(
              JSON.stringify(block.content[0].content.content)
            )}
      </p>
    ) : (
      capitalizeFirstLetterOfEachWord(block.type as string)
    );
  };

  return blocks?.length === 0 ? (
    <></>
  ) : (
    <Dropdown>
      <DropdownTrigger>
        <div
          className="rounded-full w-8 h-8 flex bg-default items-center justify-center"
          role="button"
        >
          <IconUI
            name="order"
            width={ICON_SIZE.width}
            height={ICON_SIZE.height}
          />
        </div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Static Actions"
        selectionMode="single"
        selectedKeys={[selectedKeys]}
        onAction={(key) => setSelectedKeys(key)}
        style={{ maxWidth: 300 }}
      >
        {blocks?.map((block) => (
          <DropdownItem
            onClick={(e): void => _actionHandler(e, block.uuid as string)}
            key={block.uuid}
            startContent={
              <IconUI
                name={
                  block.type?.replace(/\s/g, "").toLocaleLowerCase() as string
                }
                width={ICON_SIZE.width}
                height={ICON_SIZE.height}
                {...{ color: getBlockColor(block.type as string).color }}
              />
            }
          >
            {_getContent(block)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default NavigateBlock;
