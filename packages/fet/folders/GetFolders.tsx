import { useEffect } from "react";
import {  CompleteFolder } from "schemas";
import {  FolderService } from "lib";
import { TOnError, TOnFetch } from "./types";

const GetFolders = ({
  onFetch,
  onError,
}: {
  onFetch: TOnFetch;
  onError: TOnError;
}) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const courses = await FolderService.getFolders()
        const { data } = courses;
        onFetch(data as CompleteFolder[]);
      } catch (error: any) {
        onError(error?.message || "An error occurred");
      }
    };

    fetchData();
  }, []);

  return null;
};

export default GetFolders;
