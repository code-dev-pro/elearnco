import { useCoursesParams } from "customhooks";
import { useCourseStore } from "store";
import EditableUI from "ui/editable/EditableUI";

const TitlePageComponent = () => {
  const { updatePage, pages } = useCourseStore();
  const { getCurrentPage } = useCoursesParams();

  const index = getCurrentPage();
  const currentStatePage = pages[index - 1];

  const defaultText =
    currentStatePage?.title === ""
      ? `page ${getCurrentPage()}`
      : currentStatePage?.title;

  const _updatePage = (title): void => {
    if (title !== currentStatePage?.title) updatePage(index, { title: title });
  };

  return (
    <div className="absolute flex justify-center items-center h-full left-2 top-0 z-50 text-white">
      <EditableUI defaultText={defaultText as string} callback={_updatePage} />
    </div>
  );
};

export default TitlePageComponent;
