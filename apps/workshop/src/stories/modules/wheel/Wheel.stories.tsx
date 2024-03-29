import type { Meta } from "@storybook/react";
import WheelUI from "ui/modules/wheelModule/index";
import { IWheel } from "ui/modules/wheelModule/interface";

const meta = {
  title: "Components/Modules/Wheel",
  component: WheelUI,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    isReadOnly: {
      options: [true, false],
      control: { type: "select" },
    },
    onChange: { action: "Action" },
  },
} satisfies Meta<typeof WheelUI>;

export default meta;

export const Select = {
  render: (args: IWheel) => (
    <WheelUI
      data={[]}
      onChange={args.onChange}
      isReadOnly={args.isReadOnly}
      color=""
    />
  ),
};
