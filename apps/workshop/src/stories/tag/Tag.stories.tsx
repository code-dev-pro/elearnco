import type { Meta, StoryObj } from "@storybook/react";
import { TagUI } from "ui";

const meta = {
  title: "Components/Tags",
  component: TagUI,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof TagUI>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Tags: Story = {
  render: () => (
    <>
      <TagUI forUserEmail={false} section={[]} all={[]} />
      <TagUI forUserEmail section={[]} all={[]} />
    </>
  ),
};
