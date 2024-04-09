"use client";
import { Button } from "@nextui-org/react";
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import Code from "@tiptap/extension-code";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Focus from "@tiptap/extension-focus";
import keepMarks from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Strike from "@tiptap/extension-strike";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import React from "react";
import { ActivityBlockType, GenericObject, isBlockIsDev } from "schemas";
import { BLOCK_TEXT_LIST, TextBlockType } from "schemas/blocks/text";

import IAModule from "../iaModule";
import BubbleMenu from "./bubbleMenu";
import styles from "./Editor.module.scss";

type TBlockModule = {
  onChange: (data: { content: string; type: TextBlockType }) => void;
  type: TextBlockType;
  uuid: string;
  content: GenericObject | string;
  containerType: string;
  editable: boolean;
};

const WriterModule = (props: TBlockModule) => {
  const {
    type = TextBlockType,
    uuid,
    onChange,
    content,
    containerType = "",
    editable = true,
  } = props;

  const contentType = content || type;

  

  const testContent = isBlockIsDev.every(
    (term: string) => contentType !== term
  );
  function handleTitleEditorKeyDown() {
    void 0;
  }

  const titleEditor = useEditor(
    {
      extensions: [
        Document.extend({
          content: "heading",
        }),
        Text,
        Heading.configure({
          levels: [2],
        }),
        Placeholder.configure({
          placeholder: "Enter your title",
        }),
      ],
      content: !testContent ? undefined : contentType,
      onUpdate: ({ editor }): void => {
        onChange?.({ content: editor.getHTML(), type: type as TextBlockType });
      },

      editable,
    },
    [uuid, editable]
  );

  const contentEditor = useEditor(
    {
      extensions: [
        // Nodes
        Document,
        Text,
        Paragraph,
        Blockquote.extend({
          addInputRules: () => [],
        }),
        Heading.configure({
          levels: [1, 2, 3],
        }),

        // Format
        Bold,
        Italic,
        Strike,
        Underline,
        Highlight,
        Link,
        Code,
        Subscript,
        Superscript,
        keepMarks,
        // Extensions

        Focus,
        Dropcursor.configure({
          width: 3,
          color: "#BFE5F4",
          class: "drop-cursor",
        }),

        Placeholder.configure({
          placeholder: `Write your ${type as string}`,
        }),
      ],
      content: !testContent ? undefined : contentType,
      onUpdate: ({ editor }) => {
        onChange?.({ content: editor.getHTML(), type: type as TextBlockType });
      },

      editable,
    },
    [uuid, editable]
  );

  return (
    <div className="flex flex-col w-full">
      <div className={styles.editorContainer}>
        {(type as string) === (TextBlockType.TITLE as string) ? (
          <EditorContent
            className={styles.titleEditor}
            editor={titleEditor}
            onKeyDown={handleTitleEditorKeyDown}
            spellCheck="false"
          />
        ) : (
          <EditorContent
            className={styles.contentEditor}
            editor={contentEditor}
            spellCheck="false"
          />
        )}
        {contentEditor?.isEditable && <BubbleMenu editor={contentEditor} />}
      </div>

      {BLOCK_TEXT_LIST.includes(type as TextBlockType) &&
      containerType !== (ActivityBlockType.MULTIPLE_CHOICE as string) ? (
        <div className="flex justify-between items-end gap-2">
          <p className="text-tiny text-default-400">
            AI can make mistakes. Consider checking important information.
          </p>
          <div className="flex justify-end gap-2">
            <IAModule
              startIA={() => void 0}
              progressIA={(msg: string): void => {
                type === TextBlockType.TITLE
                  ? titleEditor?.commands.setContent(msg)
                  : contentEditor?.commands.setContent(msg);
              }}
              endIA={(msg: string): void => {
                onChange?.({ content: msg, type: type as TextBlockType });
                type === TextBlockType.TITLE
                  ? titleEditor?.commands.setContent(msg)
                  : contentEditor?.commands.setContent(msg);
              }}
            />
            <Button
              onClick={(): boolean | undefined =>
                type === TextBlockType.TITLE
                  ? titleEditor?.commands.clearContent(true)
                  : contentEditor?.commands.clearContent(true)
              }
              size="sm"
            >
              Clear
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default WriterModule;
