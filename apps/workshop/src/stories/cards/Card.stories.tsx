import type { Meta, StoryObj } from "@storybook/react";
import {
  CompleteAuthor,
  CompleteCourse,
  CompleteFolder,
  CompleteUser,
} from "schemas";

import { CourseStatus, CourseMode, CourseType } from "schemas/menus";
import { CardContentUI } from "ui";

const meta = {
  title: "Components/Card",
  component: CardContentUI,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: { type: "text" },
    },
    image: {
      control: { type: "text" },
    },
    description: {
      control: { type: "text" },
    },
    status: {
      options: [CourseStatus.ACTIVE, CourseStatus.ARCHIVED, CourseStatus.DRAFT],
      control: { type: "select", default: CourseStatus.ARCHIVED },
    },
    mode: {
      options: [CourseMode.PRIVATE, CourseMode.PUBLIC],
      control: { type: "select" },
    },
    type: {
      options: [CourseType.CLASSIC, CourseType.LIVE, CourseType.WORK],
      control: { type: "select" },
    },
    actionHandler: { action: "Action" },
  },
} satisfies Meta<typeof CardContentUI>;

export default meta;
type Story = StoryObj<typeof meta>;
type TActionHandler = { actionHandler: (action: string) => void };
export const Card = {
  render: (args: CompleteCourse & TActionHandler & { banner: string }) => (
    <div className="flex gap-4">
      <CardContentUI
        id=""
        userId=""
        actionHandler={args.actionHandler}
        title={args.title}
        description={args.description}
        status={args.status}
        type={args.type}
        mode={args.mode}
        updatedAt={new Date()}
        createdAt={new Date()}
        authorId=""
        folder={
          {
            id: "",
            userId: "",
            updatedAt: new Date(),
            createdAt: new Date(),
            name: "test",
          } as CompleteFolder
        }
        banner={
          args.image
            ? args.image
            : "https://images.unsplash.com/photo-1558244661-d248897f7bc4?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        author={
          {
            id: "",
            userId: "",
            updatedAt: new Date(),
            createdAt: new Date(),
            image: "default",
            role: "TEACHER",
            name: "loub",
          } as CompleteAuthor
        }
        user={{ name: "lh" } as CompleteUser}
        pages={[]}
        tags={args.tags || []}
        image=""
      />
    </div>
  ),
} as unknown as Story;
