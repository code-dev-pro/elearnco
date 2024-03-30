import type { Meta, StoryObj } from "@storybook/react";
import { UserUI } from "ui";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Components/User",
  component: UserUI,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    name: {
      control: "text",
    },
    description: {
      control: "text",
    },
    image: {
      control: "text",
    },
  },
} satisfies Meta<typeof UserUI>;

export default meta;
type Story = StoryObj<typeof meta>;


export const UserStory: Story = {
  decorators: [],
  name: "User",
  parameters: {},
  args: {
    description: "Teacher",
    name: "Laurent Heneman",
    image: "https://i.pravatar.cc/150?u=a04258114e29026702d",
  },
};
