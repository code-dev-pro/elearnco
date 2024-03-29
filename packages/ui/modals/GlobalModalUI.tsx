"use client";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React from "react";

export enum EPlacement {
  AUTO = "auto",
  TOP_CENTER = "top-center",
  BOTTOM_CENTER = "bottom-center",
  TOP = "top",
  BOTTOM = "bottom",
  CENTER = "center",
}
export enum EScrollBehavior {
  INSIDE = "inside",
  OUTSIDE = "outside",
  NORMAL = "normal",
}

export enum Ebackdrop {
  TRANSPARENT = "transparent",
  BLUR = "blur",
  OPAQUE = "opaque",
}
interface IProps {
  isDismissable: boolean;
  isOpen: boolean;
  placement: EPlacement;
  Body: JSX.Element;
  Footer?: JSX.Element;
  title: string;
  shouldBlockScroll?: boolean;
  scrollBehavior?: EScrollBehavior;
  backdrop?: Ebackdrop;
  onClose?: () => void;
  onOpenChange?: () => void;
  classNames?: string;
  size?:
    | "xl"
    | "sm"
    | "md"
    | "lg"
    | "2xl"
    | "full"
    | "xs"
    | "3xl"
    | "4xl"
    | "5xl"
    | undefined;
}

export const GlobalModalUI = (props: IProps) => {
  const {
    isOpen,
    placement,
    Body,
    Footer,
    title,
    scrollBehavior = "inside",
    backdrop,
    isDismissable,
    size = "md",
    onClose,
    onOpenChange,
    shouldBlockScroll = true,
    classNames,
  } = props;

  return (
    <Modal
      isDismissable={isDismissable}
      isOpen={isOpen}
      placement={placement}
      scrollBehavior={scrollBehavior}
      backdrop={backdrop}
      size={size}
      onClose={(): void => onClose?.()}
      onOpenChange={onOpenChange}
      shouldBlockScroll={shouldBlockScroll}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
        <ModalBody className={classNames}>{Body}</ModalBody>
        <ModalFooter>{Footer}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};
