"use client";
import { useIsCompletion } from "customhooks";
import React, { useEffect } from "react";
import { useCourseStore, usePageStore } from "store";

import { LoadingSpinnerUI } from "../loading";



export const LayoutEditorUI = (props: React.PropsWithChildren) => {
  const { children } = props;
  const { currentPage, pages } = useCourseStore();
  const { isLoading, error, fetchData } = usePageStore();
  const isCompletetion = useIsCompletion("completion");

  useEffect(() => {
    if (!isCompletetion) {
      const fetchDataAsync = async () => {
        if (pages.length) {
          const page = pages[currentPage - 1];

          try {
            await fetchData(page.id);
          } catch (error) {
            throw new Error("Fetching page failed");
          }
        }
      };
      fetchDataAsync();
    }
  }, []);

  if (isLoading) return <LoadingSpinnerUI />;
  if (error) return <>Error</>;

  return <>{children}</>;
};

export default LayoutEditorUI;
