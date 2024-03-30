import type { Meta } from "@storybook/react";
import { DraggableBlockType, MediaBlockType, TextBlockType } from "schemas";
import { BlockCardUI } from "ui";

const meta = {
  title: "Components/BlockCard",
  component: BlockCardUI,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      options: [
        TextBlockType.TITLE,
        TextBlockType.CITATION,
        MediaBlockType.VIDEO,
      ],
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof BlockCardUI>;

export default meta;

export const BlockCard = {
  render: (args:{type:DraggableBlockType}) => (
    <BlockCardUI
      type={args.type}
      onMouseDown={() => void 0}
      draggedBlockType={undefined}
      category="Category" 
      blockType={TextBlockType.TITLE} 
      section="Section"    />
  ),
};
