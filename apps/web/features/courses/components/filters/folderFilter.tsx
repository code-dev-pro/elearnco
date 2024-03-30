import { getId } from "lib";
import { useEffect } from "react";
import { useFoldersStore } from "store";
import { SelectUI } from "ui";
interface Iprops {
  onChange: (value: string) => void;
  currentFolder: string;
}

const FolderFilter = (props: Iprops) => {
  const { onChange, currentFolder } = props;
  const { folders, isLoading, fetchDataFolders } = useFoldersStore();
  const changeHandlerFolders = (value: string): void => {
    const course = folders.filter((item) => value === item.id);

    if (course.length > 0) {
      onChange?.(course[0].name as string);
    }
  };

  useEffect(() => {
    fetchDataFolders();
  }, []);

  if (isLoading) return <></>;

  return (
    <SelectUI
      data={folders}
      label={`Filter by folder (${folders.length})`}
      placeholder="Default"
      labelPlacement="inside"
      onChange={changeHandlerFolders}
      variant="flat"
      selectedKey={getId(folders, currentFolder)}
    />
  );
};

export default FolderFilter;
