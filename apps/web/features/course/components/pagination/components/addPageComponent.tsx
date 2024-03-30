import { Button, Tooltip } from "@nextui-org/react";
import { useCoursesParams, useIsCollaboration } from "customhooks";
import { ERoutes } from "schemas";
import { useCourseStore } from "store";
import { useRouter } from "next13-progressbar";
import { usePathname } from "next/navigation";
import { getCourseId } from "lib/utils";
const AddPageComponent = () => {
  const isCollaboration = useIsCollaboration("/collaboration");
  const router = useRouter();
  const pathname = usePathname();
  const { getCurrentPage } = useCoursesParams();
  const currentPage = getCurrentPage();
  const courseID = getCourseId(pathname);
  const { addPage } = useCourseStore();
  const gotoPage = (newPage: number): void => {
    const SEGMENT = isCollaboration ? ERoutes.COLLABORATION : ERoutes.EDITOR;
    router.push(`/${SEGMENT}/${courseID}/?page=${newPage}`);
  };

  const _addPage = async (): Promise<void> => {
    await addPage(courseID, currentPage + 1);
    gotoPage(currentPage + 1);
  };

  return (
    <Tooltip content="Add page">
      <Button
        radius="full"
        size="sm"
        isIconOnly
        color="primary"
        aria-label="Add"
        onClick={_addPage}
      >
        <span className="flex font-bold text-white z">+</span>
      </Button>
    </Tooltip>
  );
};

export default AddPageComponent;
