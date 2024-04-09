import { useAutoSave } from "customhooks/use-auto-save";
import { BlockNodeService } from "lib";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityBlockType,
  BLOCK_ACTIVITY_LIST,
  BLOCK_MEDIA_LIST,
  BLOCK_TEXT_LIST,
  GenericObject,
  MediaBlockType,
  TextBlockType,
  TModuleAudio,
  TModuleContent,
  TModuleImage,
  TModuleVideo,
  TPropModule,
  TStatus,
} from "schemas";
import { usePageStore } from "store";
import {
  DynamicMediaModule,
  DynamicQCModule,
  DynamicWheelModule,
  DynamicWriterModule,
} from "./BlockNodeDynamicContent";

const BlockNodeModule = React.memo(
  ({ ino, type }: { ino: string; type: string }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { setActiveBlock } = usePageStore();
    // const { onBeginLoading, onStopLoading } = useLoadingStore();

    const [block, setIblock] = useState<TModuleContent>();
    const [content, setContent] = useState<GenericObject | undefined>();

    // Focus to highlight block
    // const _onFocus = (e: any): void => {
    //   e.preventDefault();
    //   e.stopPropagation();
    //   setActiveBlock(ino);
    // };

    const _onchange = (prop: TPropModule | GenericObject): void => {
      
      console.log(prop)
      
      if (BLOCK_TEXT_LIST.includes(type as TextBlockType)) {
        const dataContent = {
          content: prop?.content ? prop.content : content?.content,
          type: type,
          id: ino,
        };
        setContent(dataContent);
      } else if (BLOCK_ACTIVITY_LIST.includes(type as ActivityBlockType)) {
        const dataContent = {
          id: ino,
          title: "",
          description: "",
          copyright: "",
          instruction:
            prop.type === "instruction" ? prop.content : content?.instruction,
          content: prop.type !== "instruction" ? prop : content?.content,
        };

        setContent(dataContent);
      } else if (BLOCK_MEDIA_LIST.includes(type as MediaBlockType)) {
        const _prop = prop as TModuleVideo | TModuleAudio | TModuleImage;
        const dataContent = {
          id: ino,
          markers: _prop?.markers || content?.markers || [],
          title: _prop?.title || content?.title || "",
          description: _prop?.description || content?.description || "",
          copyright: _prop?.copyright || content?.copyright || "",
          instruction:
            _prop.type === "instruction" ? _prop.content : content?.instruction,
          content:
            _prop.type !== "instruction"
              ? _prop.content
                ? _prop.content
                : content?.content
              : content?.content,
        };

        setContent(dataContent);
      }
    };

    const getModule = useMemo((): JSX.Element => {
      if (BLOCK_TEXT_LIST.includes(type as TextBlockType)) {
        return (
          <DynamicWriterModule
            onChange={_onchange}
            content={block?.content?.content}
            type={type as TextBlockType.PARAGRAH}
            uuid={ino}
            editable
            containerType=""
          />
        );
      }
      if (type === (ActivityBlockType.MULTIPLE_CHOICE as string)) {
        return (
          <>
            <DynamicWriterModule
              onChange={_onchange}
              content={block?.content?.instruction}
              type={"instruction" as TextBlockType.PARAGRAH}
              uuid={ino}
              editable
              containerType=""
            />

            <DynamicQCModule
              onChange={_onchange}
              content={block?.content?.content}
              type={type}
              isReadOnly={false}
            />
          </>
        );
      }
      if (type === (ActivityBlockType.WHEEL as string)) {
        return (
          <>
            <DynamicWriterModule
              onChange={_onchange}
              content={block?.content?.instruction}
              type={"instruction" as TextBlockType.PARAGRAH}
              uuid={ino}
              containerType=""
              editable
            />

            <DynamicWheelModule
              onChange={_onchange}
              data={block?.content?.content?.data}
              color={block?.content?.content?.color}
              isReadOnly={false}
            />
          </>
        );
      }

      if (
        type === (MediaBlockType.IMAGE as string) ||
        type === (MediaBlockType.VIDEO as string) ||
        type === (MediaBlockType.AUDIO as string)
      ) {
        return (
          <>
            <DynamicWriterModule
              onChange={_onchange}
              content={content?.instruction}
              type={"instruction" as TextBlockType.PARAGRAH}
              uuid={ino}
              containerType=""
              editable
            />
            <DynamicMediaModule
              onChange={_onchange}
              content={content?.content}
              title={content?.title}
              description={content?.description}
              copyright={content?.copyright}
              markers={content?.markers}
              type={type}
              uuid={ino}
              id={block?.id as string}
              drawing={block?.Drawing ? block?.Drawing : []}
              blockNodeId={ino}
            />
          </>
        );
      }

      return <>No module founded...</>;
    }, [type, content, ino, block]);

    const fetchData = async (): Promise<void> => {
      if (ino) {
        const { status, data } = (await BlockNodeService.getBlockNode(ino)) as {
          status: TStatus;
          data: TModuleContent;
        };

        console.log(data)

        if (status === "success") {
          setIblock(data);
          setContent(data?.content);
          setIsLoading(false);
        }
      }
    };

    const saveBlocksToDatabase = useCallback(async (): Promise<void> => {
      try {
        //onBeginLoading();
        console.log(content)
        if (content) BlockNodeService.updateBlockNode(content);
      } catch (error) {
        console.error("Erreur : ", error);
      }
      //onStopLoading();
    }, [content]);

    useEffect(() => {
      const getData = async (): Promise<void> => {
        await fetchData();
      };
      getData();
    }, [ino]);

    useAutoSave(
      {
        handler: saveBlocksToDatabase,
        item: content,
        debounceTimeout: 500,
      },
      [ino]
    );

    if (isLoading) return <>Loading...</>;
    return (
      <div
        // onMouseDown={(e)=>_onFocus(e)}
        style={{ maxWidth: 1070, overflow: "hidden", margin: "0 auto" }}
      >
        {getModule}
      </div>
    );
  }
);
BlockNodeModule.displayName = "BlockNodeModule";
export default BlockNodeModule;
