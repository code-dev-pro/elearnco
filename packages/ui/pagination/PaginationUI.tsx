"use client";
import { cn, PaginationItemType, usePagination } from "@nextui-org/react";
import { useIsCompletion } from "customhooks";
import React, { useEffect } from "react";

interface IProps {
  onChange?: (page: number) => void;
  total: number;
  initialPage: number;
  isValidate?: number[];
}

export const PaginationUI = (props: React.PropsWithChildren<IProps>) => {
  const { children, onChange, total, initialPage, isValidate } = props;
  const isCompletion = useIsCompletion("completion");
  const { activePage, range, setPage } = usePagination({
    total: total,
    showControls: false,
    siblings: 1,
    boundaries: 1,
    page: initialPage,
  });

  const _onChange = (page: number): void => {
    setPage(page);
    if (isCompletion) {
      onChange?.(page);
      return;
    }

    if (activePage !== page) {
      onChange?.(page);
    }
  };

  useEffect(() => {
    void 0;
  }, [total, isValidate]);

  return (
    <div className="flex gap-2">
      <ul className="flex gap-2 items-center">
        {range.map((page, index) => {
          if (page === PaginationItemType.DOTS) {
            return (
              <li key={`${page}_${index}`} className="w-8 h-8">
                <button
                  disabled
                  className="w-full h-full bg-default rounded-full"
                >
                  ...
                </button>
              </li>
            );
          }

          return (
            <li key={page} aria-label={`page ${page}`} className="w-8 h-8">
              <button
                className={cn(
                  "flex justify-center items-center w-full h-full bg-default rounded-full",
                  activePage === page && !isCompletion ? "bg-foreground" : ""
                )}
                onClick={() => _onChange(page as number)}
              >
                <span
                  className={cn(
                    "flex justify-center items-center w-7 h-7 rounded-full",
                    isValidate?.includes(page as number)
                      ? "bg-success"
                      : "bg-default",
                    isValidate?.includes(page as number)
                      ? "text-black"
                      : "text-white"
                  )}
                >
                  {page}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {children}
    </div>
  );
};
