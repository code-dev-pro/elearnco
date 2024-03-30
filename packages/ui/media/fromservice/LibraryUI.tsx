"use client";
import { Pagination } from "@nextui-org/react";
import useLocalStorage from "customhooks/use-local-storage";
import React, { useEffect, useState } from "react";
import { EActionsMedia, GenericObject } from "schemas";
import { useCourseStore } from "store";

import { LoadingSpinnerUI } from "../../loading";
import SearchUI from "../../search/SearchUI";
import Collection from "./Collection";

interface Photo {
  id: string;
  urls: {
    regular: string;
  };
}

interface IProps {
  action: string;
  onClose?: () => void;
  callback?: (data: GenericObject) => void;
}

export const LibraryUI = (props: IProps) => {
  const { action, callback, onClose } = props;

  const { updateBanner } = useCourseStore();
  const [isSearch, setSearch] = useLocalStorage<string>(
    "search_in_library",
    "dog"
  );
  const [error, setError] = useState<string>("");
  const [medias, setMedias] = useState<Photo[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const _handleClick = (url: string, title: string, user: string): void => {
    if (action === (EActionsMedia.UPDATE_IMAGE_BANNER as string)) {
      updateBanner(url);
    }

    callback?.({ content: url, title: title, copyright: user });
    onClose?.();
  };

  const _handleChange = async (value: string): Promise<void> => {
    await _handleSearch(value);
  };

  const fetchData = async (query: string, page: number, perpage: number) => {
    try {
      const response = await fetch(
        `/api/unsplash?query=${query}&page=${page}&perPage=${perpage}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const { photos: fetchedPhotos, totalPages: fetchedTotalPages } =
        await response.json();

      setMedias(fetchedPhotos);
      setTotalPages(fetchedTotalPages);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data from Unsplash API route", error);
    }
  };

  const _handleSearch = async (query: string): Promise<void> => {
    setIsLoading(true);
    setSearch(query);
    fetchData(query, 1, 12);
  };

  async function _handlePageChange(newPage: number): Promise<void> {
    setIsLoading(true);
    fetchData(isSearch, newPage, 12);
  }

  useEffect(() => {
    _handleSearch(isSearch ? isSearch : "dog");
  }, []);

  if (error !== "") return error;

  return (
    <div style={{ minHeight: "560px" }}>
      <div className="sticky top-0 bg-default-50 z-50 p-2 flex items-center justify-between">
        <SearchUI placeholder="Search an image" callback={_handleChange} />
        {totalPages === 0 ? (
          <></>
        ) : (
          <Pagination
            onChange={_handlePageChange}
            total={totalPages}
            initialPage={1}
            page={currentPage}
            size="sm"
            radius="full"
          />
        )}
      </div>
      {isLoading ? (
        <LoadingSpinnerUI isIndiv />
      ) : totalPages === 0 ? (
        <p>Nothing...</p>
      ) : (
        <Collection
          {...{
            _handleClick: _handleClick,
            collection: medias,
            _handlePageChange,
            totalPages,
            currentPage,
          }}
        />
      )}
    </div>
  );
};

export default LibraryUI;
