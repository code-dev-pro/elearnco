import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Tooltip,
} from "@nextui-org/react";
import React, { useMemo } from "react";
import {
  CompleteCourse,
  CourseMode,
  CourseStatus,
  CourseType,
  EActionsCourse,
  EActionsCourseInDrop,
  EActionsCourseInFooterCard,
  EColor,
} from "schemas";

import { BACKGROUND_NO_IMAGE, CARD, ICON_SIZE } from "../const";
import { IconUI } from "../icon/IconUI";

type ActionHandler = {
  actionHandler(action: string): void;
};

export const CardContentUI = (
  props: CompleteCourse & ActionHandler & { banner: string }
) => {
  const {
    actionHandler,
    banner,
    title,
    description,
    mode,
    status,
    type,
    updatedAt,
    author,
  } = props;

  const _getColorChipStatus = (): EColor => {
    if (status === CourseStatus.ACTIVE) return EColor.success;
    if (status === CourseStatus.ARCHIVED) return EColor.default;
    return EColor.warning;
  };

  const _getColorChipType = (): EColor => {
    if (type === CourseType.LIVE) return EColor.success;
    if (type === CourseType.CLASSIC) return EColor.primary;
    return EColor.default;
  };

  const _getColorChipMode = (): EColor => {
    if (mode === CourseMode.PRIVATE) return EColor.danger;
    return EColor.secondary;
  };

  const MenuLeft = (): React.JSX.Element[] =>
    useMemo(() => {
      return Object.values(EActionsCourseInFooterCard).map((action: string) =>
        action.toLowerCase() === "path" ? (
          <React.Fragment key={action}/>
        ) : (
          <Tooltip key={action} color="foreground" content={action}>
            <Button
              size="sm"
              radius="full"
              isIconOnly
              color="default"
              aria-label={action}
              onClick={(): void => actionHandler(action)}
            >
              <IconUI
                name={action.toLocaleLowerCase()}
                width={ICON_SIZE.width}
                height={ICON_SIZE.height}
              />
            </Button>
          </Tooltip>
        )
      );
    }, []);

  const DropdownItemMemo = (): React.JSX.Element[] =>
    useMemo(() => {
      return Object.values(EActionsCourseInDrop).map(
        (action: EActionsCourseInDrop) => (
          <DropdownItem
            startContent={
              <IconUI
                name={action.toLocaleLowerCase().split(" ")?.[0]}
                width={ICON_SIZE.width}
                height={ICON_SIZE.height}
              />
            }
            onClick={(): void => actionHandler(action)}
            key={action}
          >
            {action}
          </DropdownItem>
        )
      );
    }, []);

  return (
    <div className="relative flex justify-center items-center">
      {status === CourseStatus.ARCHIVED ? (
        <div className="absolute z-20">
          <Button
            onClick={(): void => actionHandler(EActionsCourse.UNARCHIVE)}
            color={EColor.default}
            variant="solid"
          >
            Unarchive
          </Button>
        </div>
      ) : (
        <></>
      )}
      <Card
        isDisabled={status === CourseStatus.ARCHIVED}
        className="py-0"
        style={{ width: CARD.width, height: CARD.height }}
      >
        <CardBody className="p-0">
          {banner ? (
            <Image
              alt="Course image"
              className="object-cover"
              src={banner?.split("?")?.[0]}
              width="100%"
              radius="none"
              style={{ height: "120px" }}
            />
          ) : (
            <div
              style={{ height: "120px", ...BACKGROUND_NO_IMAGE }}
              className="w-full"
            />
          )}
          <div className="pt-2 px-4 flex-col items-start">
            <div className="flex justify-between">
              <h4 className="font-bold text-large line-clamp-1">{title}</h4>
              <Tooltip color="foreground" content="Edit props course">
                <Button
                  size="sm"
                  radius="full"
                  isIconOnly
                  color="default"
                  aria-label="Edit"
                  onClick={(): void => actionHandler(EActionsCourse.EDIT)}
                >
                  <IconUI
                    name="edit"
                    width={ICON_SIZE.width}
                    height={ICON_SIZE.height}
                  />
                </Button>
              </Tooltip>
            </div>
            <p className="pt-2 text-tiny line-clamp-2">{description}</p>

            <div className="flex py-4 gap-2 flex-wrap">
              <Chip size="sm" variant="flat" color={_getColorChipStatus()}>
                {status}
              </Chip>
              <Chip size="sm" variant="flat" color={_getColorChipMode()}>
                {mode}
              </Chip>
              <Chip size="sm" variant="flat" color={_getColorChipType()}>
                {type?.toUpperCase() || "Status"}
              </Chip>
            </div>
            <div className="flex justify-end  w-full ">
              <small className="text-default-500">
                {new Date(updatedAt).toLocaleDateString()}
              </small>
            </div>
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="text-small justify-between">
          <div className="flex gap-2 items-center">
            {MenuLeft()}

            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  size="sm"
                  radius="full"
                  isIconOnly
                  color="default"
                  aria-label=""
                >
                  <IconUI
                    name="more"
                    width={ICON_SIZE.width}
                    height={ICON_SIZE.height}
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                {DropdownItemMemo()}
              </DropdownMenu>
            </Dropdown>
          </div>

          <div className="flex gap-4 items-center" />

          <Tooltip color="foreground" content={author?.name}>
            <Avatar
              size="sm"
              fallback={
                <IconUI
                  name={author?.name ? author.name : "E"}
                  width={ICON_SIZE.width}
                  height={ICON_SIZE.height}
                />
              }
              isBordered
              src={`/avatars/${author?.image}.svg`}
            />
          </Tooltip>
        </CardFooter>
      </Card>
    </div>
  );
};
