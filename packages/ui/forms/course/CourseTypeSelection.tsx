import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import React, { useState } from "react";
import { CourseType } from "schemas";

import { ICON_SIZE } from "../../const";
import { IconUI } from "../../icon/IconUI";



interface IProps {
  selected: string;
  onChange: (key: string) => void;
}

interface ICourseType {
  classic: string;
  work: string;
  live: string;
}
const descriptionsMap = {
  classic: "You are the author and you can share your learning with others.",
  work: "You can share your course with one learner and he is the author.",
  live: "You can share your course with yours learners and they collaborate for creating it.",
} as ICourseType;

const labelsMap = {
  classic: "You are the author",
  work: "Learner is the author",
  live: "Learners are the authors",
} as ICourseType;

const CourseTypeSelection = (props: IProps) => {
  const { selected, onChange } = props;
  const [selectedOption, setSelectedOption] = useState<string>(
    selected.toLocaleLowerCase()
  );

  const _onAction = (key: string) => {
    setSelectedOption(key);
    onChange?.(key.toUpperCase());
  };

  const s = selectedOption.toLowerCase();

  return (
    <ButtonGroup variant="flat">
      <Button>{labelsMap[s as keyof ICourseType]}</Button>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button isIconOnly>
            <IconUI
              name="setting"
              width={ICON_SIZE.width}
              height={ICON_SIZE.height}
            />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label="Course options"
          selectedKeys={selectedOption}
          selectionMode="single"
          style={{ maxWidth: "300px" }}
          onAction={(key) => _onAction(key as string)}
        >
          <DropdownItem
            key={CourseType.CLASSIC.toLocaleLowerCase()}
            description={
              descriptionsMap[
                CourseType.CLASSIC.toLocaleLowerCase() as keyof ICourseType
              ]
            }
          >
            {
              labelsMap[
                CourseType.CLASSIC.toLocaleLowerCase() as keyof ICourseType
              ]
            }
          </DropdownItem>
          <DropdownItem
            key={CourseType.WORK.toLocaleLowerCase()}
            description={
              descriptionsMap[
                CourseType.WORK.toLocaleLowerCase() as keyof ICourseType
              ]
            }
          >
            {
              labelsMap[
                CourseType.WORK.toLocaleLowerCase() as keyof ICourseType
              ]
            }
          </DropdownItem>
          <DropdownItem
            key={CourseType.LIVE.toLocaleLowerCase()}
            description={
              descriptionsMap[
                CourseType.LIVE.toLocaleLowerCase() as keyof ICourseType
              ]
            }
          >
            {
              labelsMap[
                CourseType.LIVE.toLocaleLowerCase() as keyof ICourseType
              ]
            }
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  );
};

export default CourseTypeSelection;
