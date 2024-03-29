import type { Meta } from "@storybook/react";
import { DropdownUI } from "ui";
import { Button } from "@nextui-org/react";
import { DATA_USER } from "schemas/mocks";


const meta = {
  title: "Components/Dropdown",
  component: DropdownUI,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof DropdownUI>;

export default meta;

const defaultChild = (
  <Button as="button" variant="bordered">
    Open Menu
  </Button>
);

export const Dropdown = {
  render: () => (
    <div className="p-2">
      <DropdownUI showArrow data={DATA_USER} placement='bottom'>
        {defaultChild}
      </DropdownUI>
     
    </div>
  ),
};
