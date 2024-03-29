import { Chip, Spinner } from "@nextui-org/react";
import { BlockService } from "lib/requests/services/blocks";
import { debounce } from "lodash";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { CompleteBlock } from "schemas";
import { State, useLoadingStore, usePageStore } from "store";

import { IconUI } from "../../icon/IconUI";

// Auto save blocks (add, delete, reorder, move up, move down) not update content
const autoSaveTimeout = 2000;
const SaveStatusIndicator = () => {
  const currentPathname = usePathname();
  const currentSearchParams = useSearchParams().get("page") ?? "";
  const [previousPathname, setPreviousPathname] =
    useState<string>(currentPathname);
  const [previousSearchParams, setPreviousSearchParams] =
    useState<string>(currentSearchParams);
  const [saveStatus, setSaveStatus] = useState<string>("Saved");
  const { isLoading } = useLoadingStore();

  const saveBlocksToDatabase = useCallback(
    async ({
      modifiedBlocks,
      deletedBlockIds,
    }: {
      modifiedBlocks: Partial<CompleteBlock>[];
      deletedBlockIds: string[];
    }) => {
      try {
        setSaveStatus("Saving...");
        const saveResult = await saveBlocksToDatabaseFunction({
          modifiedBlocks,
          deletedBlockIds,
        });

        if (saveResult.status === "success") {
          setSaveStatus("Saved");
        } else {
          setSaveStatus("Error during saving");
        }
      } catch (error) {
        setSaveStatus("Error...");
      }
    },
    []
  );

  const saveBlocksToDatabaseFunction = async ({
    modifiedBlocks,
    deletedBlockIds,
  }: {
    modifiedBlocks: Partial<CompleteBlock>[];
    deletedBlockIds: string[];
  }) => {
    return await BlockService.updateManyBlock({
      modifiedBlocks,
      deletedBlockIds,
    });
  };

  const _saveBlock = (state: State): void => {
    const modifiedBlocks = state.blocks.filter(
      (block: Partial<CompleteBlock & { action: string }>) =>
        block.action !== undefined
    );
    const deletedBlockIds = state.deletedBlockIds;
    if (modifiedBlocks.length > 0 || deletedBlockIds.length > 0) {
      saveBlocksToDatabase({
        modifiedBlocks: modifiedBlocks,
        deletedBlockIds: deletedBlockIds,
      });
    }
  };

  const _getState = (): State => {
    const state = usePageStore.getState();
    return state;
  };

  useEffect(() => {
    const handleBeforeUnload = ():void => {
      const state = _getState();
      _saveBlock(state);
    };

    const handleVisibilityChange = ():void => {
      const state = _getState();
      _saveBlock(state);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (currentPathname !== previousPathname) {
      const state = _getState();
      _saveBlock(state);
      setPreviousPathname(currentPathname);
    }
  }, [currentPathname]);

  useEffect(() => {
    if (currentSearchParams !== previousSearchParams) {
      const state = _getState();
      _saveBlock(state);
      setPreviousSearchParams(currentSearchParams);
    }
  }, [currentSearchParams]);

  useEffect(() => {
    const unsubscribe = usePageStore.subscribe(
      debounce((state, prevState) => {
        _saveBlock(state);
      }, autoSaveTimeout)
    );

    return () => {
      unsubscribe();
    };
  }, []);

  if (!currentPathname.includes("editor")) return <></>;

  if (currentPathname.startsWith("Error"))
    return (
      <Chip
        startContent={<IconUI width={20} name="warning" />}
        variant="faded"
        color="danger"
      >
        {saveStatus}
      </Chip>
    );

  if (saveStatus === "Saving...")
    return (
      <Chip
        startContent={<Spinner color="warning" size="sm" />}
        variant="faded"
        color="warning"
      >
        {saveStatus}
      </Chip>
    );

  return (
    <Chip
      startContent={<IconUI width={20} name="check" />}
      variant="faded"
      color="success"
    >
      {saveStatus}
    </Chip>
  );
};

export default SaveStatusIndicator;
