import type { Meta, StoryObj } from "@storybook/react";
import ConfettisEffect from "ui/confetti";

const meta = {
  title: "Components/Confetti",
  component: ConfettisEffect,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
   
    effect: {
      options: ["left", "right", "top", "bottom"],
      control: { type: "select" },
    },
    
  },
} satisfies Meta<typeof ConfettisEffect>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Confettis = {
  render: () => (
    <div style={{ width: "100%", height: "100vh" }}>
     
      <ConfettisEffect />
    </div>
  ),
} as unknown as Story;
