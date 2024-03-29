import { Button } from "@nextui-org/react";
import { CellSelection } from "@tiptap/prosemirror-tables";
import {
  BubbleMenu as TiptapBubbleMenu,
  Editor,
  isNodeSelection,
} from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { IconUI } from "ui/icon/IconUI";

import { ICON_SIZE } from "../../const";

function isCellSelection(value: unknown): value is CellSelection {
  return value instanceof CellSelection;
}

interface BubbleMenuProps {
  editor: Editor;
}

const BubbleMenu = (props: BubbleMenuProps) => {
  const { editor } = props;
  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * Keep track of whether the user is selecting with the mouse
   * to prevent glitch with the bubble menu when hovering it
   */
  const [isSelecting, setIsSelecting] = useState(false);
  useEffect(() => {
    function handleMouseDown() {
      function handleMouseMove() {
        if (!editor.state.selection.empty) {
          setIsSelecting(true);
          document.removeEventListener("mousemove", handleMouseMove);
        }
      }

      function handleMouseUp() {
        setIsSelecting(false);

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      }

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <TiptapBubbleMenu
     className="bubble-menu"
      editor={editor}
      tippyOptions={{
        duration: 100,
        arrow: false,
        appendTo: "parent",
        animation: "shift-away",
        inertia: true,
      }}
      shouldShow={({ view, state, editor }) => {
        const { selection } = state;

        const { empty } = selection;
        const hasEditorFocus = view.hasFocus();

        if (
          !hasEditorFocus ||
          empty ||
          !editor.isEditable ||
          isNodeSelection(selection) ||
          isCellSelection(selection) ||
          isSelecting
        ) {
          return false;
        }

        return true;
      }}
    >
      {isSelecting ? null : (
        <div className="flex bg-background rounded-full p-2" ref={menuRef}>
          <Button
            startContent={<IconUI name="bold" width={ICON_SIZE.width} height={ICON_SIZE.height} />}
            className={editor.isActive("bold") ? "bg-default":"bg-background"}
            isIconOnly
            size="sm"
            onClick={() => {
              editor.chain().focus().toggleBold().run();
            }}
            
          />
          <Button
            startContent={<IconUI name="italic" width={ICON_SIZE.width} height={ICON_SIZE.height} />}
            className="bg-background"
            isIconOnly
            size="sm"
            onClick={() => {
              editor.chain().focus().toggleItalic().run();
            }}
            //active={editor.isActive("italic")}
          />
          <Button
            startContent={<IconUI name="underline" width={ICON_SIZE.width} height={ICON_SIZE.height} />}
            className="bg-background"
            isIconOnly
            size="sm"
            onClick={() => {
              editor.chain().focus().toggleUnderline().run();
            }}
            //active={editor.isActive("underline")}
          />
          <Button
            startContent={<IconUI name="strikethrough" width={ICON_SIZE.width} height={ICON_SIZE.height} />}
            className="bg-background"
            isIconOnly
            size="sm"
            onClick={() => {
              editor.chain().focus().toggleStrike().run();
            }}
            //active={editor.isActive("strike")}
          />
          <Button
            startContent={<IconUI name="code" width={ICON_SIZE.width} height={ICON_SIZE.height} />}
            className="bg-background"
            isIconOnly
            size="sm"
            onClick={() => {
              editor.chain().focus().toggleCode().run();
            }}
            // active={editor.isActive("code")}
          />
          <Button
            startContent={<IconUI name="marker"width={ICON_SIZE.width} height={ICON_SIZE.height} />}
            className="bg-background"
            isIconOnly
            size="sm"
            onClick={() => {
              editor.chain().focus().toggleHighlight().run();
            }}
            // active={editor.isActive("highlight")}
          />
          <Button
            startContent={<IconUI name="subscript" width={ICON_SIZE.width} height={ICON_SIZE.height} />}
            className="bg-background"
            isIconOnly
            size="sm"
            onClick={() => {
              editor.chain().focus().toggleSubscript().run();
            }}
            // active={editor.isActive("subscript")}
          />
          <Button
            startContent={<IconUI name="superscript" width={ICON_SIZE.width} height={ICON_SIZE.height} />}
            className="bg-background"
            isIconOnly
            size="sm"
            onClick={() => {
              editor.chain().focus().toggleSuperscript().run();
            }}
            // active={editor.isActive("superscript")}
          />

          <Button
            startContent={
              editor.isActive("link") ? (
                <IconUI name="unlink"width={ICON_SIZE.width} height={ICON_SIZE.height} />
              ) : (
                <IconUI name="link" width={ICON_SIZE.width} height={ICON_SIZE.height} />
              )
            }
            className="bg-background"
            isIconOnly
            size="sm"
            onClick={() => {
              if (editor.isActive("link")) {
                editor.chain().focus().unsetLink().run();
              } else {
                const href = prompt("Entrez l'URL :");
                if (href) {
                  editor.chain().focus().toggleLink({ href }).run();
                }
              }
            }}
            //active={editor.isActive("link")}
          />
        </div>
      )}
    </TiptapBubbleMenu>
  );
};

export default BubbleMenu;
