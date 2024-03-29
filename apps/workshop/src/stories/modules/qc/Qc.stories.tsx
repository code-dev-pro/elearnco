import type { Meta } from "@storybook/react";
import { nanoid } from "lib";
import { IProps, QcUI } from "ui";
// import QcUI from "ui/modules/qc/QcUI";
// import { IProps } from "ui/modules/qc/types/types";


const meta = {
  title: "Components/Modules/Qc",
  component: QcUI,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    editable: {
      options: [true, false],
      control: { type: "select" },
    
    },
    //onAction: { action: "Action" },
  },
} satisfies Meta<typeof QcUI>;

export default meta;

export const Qc = {
  render: (args: IProps) => (
    <QcUI
      editable={args.editable}
      data={[
        {
          id: nanoid(7),
          content: "content 1",
          editable: args.editable,
          isGood:false
        },
        {
          id: nanoid(7),
          content: "content 2",
          editable: args.editable,
          isGood: false
        },
      ]}
    />
  ),
};
