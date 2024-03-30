import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@nextui-org/react";
import { formatDistanceToNow } from "date-fns";
import { enGB } from "date-fns/locale";
import { useUser } from "lib/providers/auth.provider";
import React, { useEffect, useState } from "react";
import { useCommentsStore } from "store";

import { ICON_SIZE } from "../const";
import { IconUI } from "../icon/IconUI";
import { LoadingSpinnerUI } from "../loading";
import { UserUI } from "../user/UserUI";

const Comments = ({
  uuid,
  id,
  isRounded,
}: {
  uuid: string;
  id: string;
  isRounded?: boolean;
}) => {
  const user = useUser();
  const fetchData = useCommentsStore(id)((state) => state.fetchData);
  const comments = useCommentsStore(id)((state) => state.comments);
  const isLoading = useCommentsStore(id)((state) => state.isLoading);
  const updateComment = useCommentsStore(id)((state) => state.updateComment);
  const addComment = useCommentsStore(id)((state) => state.addComment);
  const deleteComment = useCommentsStore(id)((state) => state.deleteComment);
  const deleteThread = useCommentsStore(id)((state) => state.deleteThread);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<string>("");
  const [value, setValue] = React.useState<string>("");

  const _onChange = (txt: string): void => {
    setValue(txt);
  };

  const _manageComment = (): void => {
    if (isUpdate !== "") {
      updateComment(isUpdate, value);
      setValue("");
      setIsUpdate("");
    } else {
      addComment(value, uuid, user.id);
      setValue("");
    }
  };

  const _deleteComment = (id: string): void => {
    deleteComment(id);
  };
  const _deleteThreads = (): void => {
    deleteThread();
    setValue("");
  };
  const _updateComment = (id: string, content: string): void => {
    setValue(content);
    setIsUpdate(id);
  };

  const _cancelComment = (): void => {
    setValue("");
    setIsUpdate("");
  };

  useEffect(() => {
    if (!isOpen && id && uuid) {
      const getComments = async () => {
        await fetchData(uuid);
      };

      getComments();
    }
  }, [id, isOpen, uuid]);

  return (
    <Popover
      shouldFlip
      shouldCloseOnBlur
      shouldBlockScroll
      showArrow
      offset={10}
      placement="right-end"
      isOpen={isOpen}
      shouldCloseOnInteractOutside={(e) => {
        if (
          e.id === "comments" ||
          e.id === "delete_comment" ||
          e.id === "update_comment" ||
          e.id === "delete_thread"
        ) {
          return false;
        }
        setIsUpdate("");
        setIsOpen(false);
        return true;
      }}
    >
      <PopoverTrigger>
        <div className="z-10">
          <Badge
            content={comments.length}
            shape="circle"
            showOutline={false}
            size="sm"
            style={{ background: "BACKGROUND_COLOR" }}
          >
            <Tooltip
              showArrow
              shouldCloseOnBlur
              shouldFlip
              placement="top"
              offset={0}
              content="add comment"
              color="default"
            >
              <Button
                size="sm"
                isIconOnly
                onClick={() => setIsOpen((prevState) => !prevState)}
                aria-label="add comment"
                variant="flat"
                style={{
                  borderTopLeftRadius: isRounded ? "50%" : 0,
                  borderBottomLeftRadius: isRounded ? "50%" : 0,
                  borderTopRightRadius: "50%",
                  borderBottomRightRadius: "50%",
                }}
              >
                <IconUI
                  width={ICON_SIZE.width}
                  height={ICON_SIZE.height}
                  name="comment"
                />
              </Button>
            </Tooltip>
          </Badge>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[300px]">
        {() => (
          <div className="px-1 py-2 w-full">
            {isLoading ? (
              <LoadingSpinnerUI isIndiv />
            ) : (
              <>
                {comments?.map((comment) => {
                  return (
                    <React.Fragment key={comment.id}>
                      <div className="px-1 py-2 w-full flex justify-between">
                        <div className="w-full">
                          <UserUI
                            description={
                              comment?.createdAt
                                ? formatDistanceToNow(
                                    new Date(comment?.createdAt),
                                    { addSuffix: true, locale: enGB }
                                  )
                                : "..."
                            }
                            name={comment?.user?.name as string}
                            image={comment?.user?.image as string}
                          />
                        </div>
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              style={{ borderRadius: "100%" }}
                              variant="flat"
                              isIconOnly
                              radius="full"
                              startContent={
                                <IconUI
                                  name="setting"
                                  width={ICON_SIZE.width}
                                  height={ICON_SIZE.height}
                                />
                              }
                            />
                          </DropdownTrigger>
                          <DropdownMenu
                            variant="faded"
                            aria-label=""
                            disabledKeys={
                              comment?.user?.name !== user?.name
                                ? ["delete_thread"]
                                : []
                            }
                          >
                            <DropdownItem
                              onClick={_deleteThreads}
                              key="delete_thread"
                              aria-label="delete_thread"
                            >
                              <span id="delete_thread">Delete thread</span>
                            </DropdownItem>

                            <DropdownItem
                              onClick={() =>
                                _updateComment(comment.id, comment.content)
                              }
                              key="update_comment"
                              aria-label="update_comment"
                            >
                              <span id="update_comment">Update comment</span>
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => _deleteComment(comment.id)}
                              key="delete_comment"
                              aria-label="delete_comment"
                            >
                              <span id="delete_comment">Delete comment</span>
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                      {isUpdate === comment.id ? (
                        <Input
                          type="text"
                          onValueChange={_onChange}
                          placeholder="Answer..."
                          value={value}
                        />
                      ) : (
                        <p className="text-tiny py-2 mb-2">
                          {comment?.content}
                        </p>
                      )}
                    </React.Fragment>
                  );
                })}
                <>
                  {isUpdate === "" ? (
                    <Input
                      type="text"
                      onValueChange={_onChange}
                      placeholder="Answer to..."
                      value={value}
                    />
                  ) : (
                    <></>
                  )}

                  <div className="mt-2 w-full flex justify-end gap-2">
                    <span>
                      <Button
                        onClick={_cancelComment}
                        isDisabled={value === ""}
                        color="default"
                        variant="bordered"
                      >
                        Cancel
                      </Button>
                    </span>
                    <span>
                      <Button
                        onClick={() => _manageComment()}
                        isDisabled={value === ""}
                        color="default"
                      >
                        {isUpdate === ""
                          ? "Add comment or Answer"
                          : "update comment"}
                      </Button>
                    </span>
                  </div>
                </>
              </>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Comments;
