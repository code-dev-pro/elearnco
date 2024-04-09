"use client";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
} from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
const PROMPT_SIZE = 300;

type IAM = {
  startIA?: () => void;
  endIA?: (msg: string) => void;
  progressIA?: (msg: string) => void;
};

const IAModule = (props: IAM) => {
  const { startIA, endIA, progressIA } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  //const [isLoading, setIsLoading] = useState<boolean>(false);
  const [value, setValue] = React.useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const refTimeout = useRef<NodeJS.Timeout>();
  const refIsCancel = useRef<boolean>(false);

  const {
    completion,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    setInput,
  } = useCompletion({
    body: { value },
    onFinish: (prompt, completion) => {
      setValue(completion.trim());
      endIA?.(completion.trim());
    },
    onError: (error) => toast.error(error.message),
  });

  const _onValueChange = (txt: string):void => {
    if (txt.length > PROMPT_SIZE) {
      return;
    }
    //handleInputChange(txt)
    //setValue(txt);
  };
  const cancelRequest = ():void => {
    if (abortControllerRef.current) {
      refIsCancel.current = true;
      abortControllerRef.current.abort();
      // setIsLoading(false);
    }
  };

  const displayWords = (index: number, stream: string[]): void => {
    if (index >= stream.length || refIsCancel.current) {
      if (refTimeout.current) clearTimeout(refTimeout.current);
      return;
    }

    progressIA?.(stream[index]);
    refTimeout.current = setTimeout(() => {
      if (refTimeout) clearTimeout(refTimeout.current);
      displayWords(index + 1, stream);
    }, 50);
  };

  const callIa = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) {
      return;
    } else {
      refIsCancel.current = false;
      abortControllerRef.current = new AbortController();
      startIA?.();
      //setIsLoading(true);
      const magic = await fetch("/api/gpt/chat", {
        method: "POST",
        body: JSON.stringify({ content: value }),
        signal: abortControllerRef.current.signal,
      });

      const { data } = (await magic.json()) as { data: string };
      let currentMessage = "";

      const cleanedCompletion = data.replace(/(\r\n|\n|\r)/gm, "");

      const dataArray = cleanedCompletion.split("data: ");
      dataArray.shift();
      const stream: string[] = [];

      for (const dataString of dataArray) {
        if (dataString !== "[DONE]") {
          const dataObject = JSON?.parse?.(dataString);
          if (dataObject.choices[0].finish_reason === "stop") {
            displayWords(0, stream);
            endIA?.(currentMessage);
            currentMessage = "";
            // setIsLoading(false);
          } else {
            currentMessage += dataObject.choices[0].delta.content;
            stream.push(currentMessage.replace(/\n/g, "<br/>"));
          }
        }
      }
    }
  };

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    fetch("/api/completion").catch(() => {});
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  console.log('INPUT: ', input,typeof input)
 

  return (
    <Popover
      shouldFlip
      shouldCloseOnBlur
      shouldBlockScroll
      showArrow
      offset={10}
      placement="top"
      isOpen={isOpen}
      shouldCloseOnInteractOutside={(e) => {
        if (e.id === "submit-ia") {
          return false;
        }

        setIsOpen(false);
        return true;
      }}
    >
      <PopoverTrigger>
        <Button
          onClick={(): void => setIsOpen((isOpen) => !isOpen)}
          id="submit-ia"
          size="sm"
        >
          {!isLoading ? "IA" : "Cancel"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px]">
        {() => (
          <div className="w-full h-full box-border relative">
            <p className="py-1 text-tiny text-default-400 flex justify-end">
              {value.length}/{PROMPT_SIZE}
            </p>
            <form
              onSubmit={(e) => {
                handleSubmit(e);
                setInput("");
              }}
            >
              <Textarea
                label=""
                labelPlacement="outside"
                placeholder="Enter a prompt here"
                className="max-w-xs mb-2"
                value={input}
                // onValueChange={_onValueChange}
                onChange={handleInputChange}
              />
              <p className="text-tiny text-default-400 mb-2">
                AI can make mistakes. Consider checking important information.
              </p>
              <div className="flex justify-end gap-2 mb-2">
                <Button
                  isDisabled={input==="" ? false : true}
                  // onClick={callIa}
                  isLoading={isLoading}
                  size="sm"
                  type="submit"
                  aria-label="Submit"
                >
                  Submit
                </Button>
                <Button
                  isDisabled={!isLoading}
                  onClick={cancelRequest}
                  size="sm"
                  aria-label="Cancel"
                >
                  Cancel
                </Button>
                <Button
                  aria-label="Clear"
                  onClick={(): void => setValue("")}
                  size="sm"
                >
                  Clear
                </Button>
              </div>
            </form>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default IAModule;
