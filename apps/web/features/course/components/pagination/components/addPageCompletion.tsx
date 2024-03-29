import { Button, Tooltip } from "@nextui-org/react";
import { useIsCollaboration } from "customhooks";
import { getCourseId } from "lib";
import { usePathname, useRouter } from "next/navigation";
import { ERoutes } from "schemas";
import { useCourseStore } from "store";
import { ICON_SIZE } from "ui";
import { IconUI } from "ui/icon/IconUI";

const AddPageCompletion = () => {
  const router = useRouter();
  const pathname = usePathname();
  const courseID = getCourseId(pathname);
  const { addCompletionPage } = useCourseStore();
  const isCollaboration = useIsCollaboration("/collaboration");

  const gotoPage = (newPage: string): void => {
    const SEGMENT = isCollaboration ? ERoutes.COLLABORATION : ERoutes.EDITOR;
    router.push(`/${SEGMENT}/${courseID}/?page=${newPage}`);
  };

  const _addPage = async (): Promise<void> => {
    addCompletionPage();
    gotoPage('completion');
  };

  return (
    <Tooltip content="Add page completion">
      <Button
        radius="full"
        size="sm"
        isIconOnly
        color="primary"
        aria-label="Add"
        onClick={_addPage}
      >
        <IconUI
          name="realist"
          width={ICON_SIZE.width}
          height={ICON_SIZE.height}
        />
      </Button>
    </Tooltip>
  );
};

export default AddPageCompletion;
