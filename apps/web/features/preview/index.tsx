"use client";
import { usePathname } from "next/navigation";
import { useCourseStore } from "store";
import dynamic from "next/dynamic";
//import { NavBarTopUI } from "ui/menu/NavBarTopUI";
import { appendUnit, getCourseId, reorganizePerIndex } from "lib/utils";
import { BannerUI, DrawerUI, LoadingSpinnerUI } from "ui";
import TypographyBlockUI from "ui/typography/TypographyBlockUI";
import TypographyUI from "ui/typography/TypographyUI";
import { WIDTH_SIDEBAR } from "@/const";
import { useEffect, useRef, useState } from "react";
import { ActivityBlockType, MediaBlockType, TextBlockType } from "schemas";
import styles from "./style.module.scss";
import Summary from "./summary";
import useCoursesParams from "customhooks/use-courses-params";
import ModulePreviewTitle from "./modules/modulePreviewTitle";
import ModulePreviewParagraph from "./modules/modulePreviewParagraph";
import { PaginationGeneric } from "../course/components/pagination/components/navigateGeneric";
import BarUI from "ui/menu/BarUI";

const DynamicModulePreviewImage = dynamic(
  () => import("./modules/modulePreviewImage"),
  {
    loading: () => <LoadingSpinnerUI />,
  }
);
const DynamicModulePreviewQC = dynamic(
  () => import("./modules/modulePreviewQC"),
  {
    loading: () => <LoadingSpinnerUI />,
  }
);
const DynamicModulePreviewWheel = dynamic(
  () => import("./modules/modulePreviewWheel"),
  {
    loading: () => <LoadingSpinnerUI />,
  }
);
const DynamicModulePreviewVideo = dynamic(
  () => import("./modules/modulePreviewVideo"),
  {
    loading: () => <LoadingSpinnerUI />,
  }
);

const STYLE = {
  flex: "0 0 auto",
  transition: "width .35s cubic-bezier(.22, 1, .36, 1)",
};

const getBlock = (block): JSX.Element => {
  const type = block.type;
  const content = block.content?.[0]?.content;
  const text = content?.content;
  const title = content?.title;
  const instruction = content?.instruction;
  const description = content?.description;
  const copyright = content?.copyright;
  const markers = content?.markers;
  const uuid = block?.uuid;
  const drawing = block?.content?.[0]?.Drawing;
  const id = block?.id;

  if (type === ActivityBlockType.WHEEL && text) {
    return (
      <div className="bg-default-50 rounded-2xl">
        <DynamicModulePreviewWheel
          text={text}
          instruction={instruction}
          type={type}
          uuid={uuid}
          id={id}
        />
      </div>
    );
  }

  if (type === ActivityBlockType.MULTIPLE_CHOICE) {
    return (
      <div className="bg-default-50 rounded-2xl">
        <DynamicModulePreviewQC
          text={text}
          instruction={instruction}
          type={type}
          uuid={uuid}
          id={id}
        />
      </div>
    );
  }

  if (
    (type === TextBlockType.TITLE || type === TextBlockType.SUBTITLE) &&
    text &&
    text !== ""
  ) {
    return <ModulePreviewTitle type={type} text={text} />;
  }

  if (type === MediaBlockType.IMAGE && text && text !== "") {
    return (
      <div className="flex w-full flex-col">
        <TypographyBlockUI>
          <TypographyBlockUI.Definition type={type}>
            <ModulePreviewParagraph text={instruction} />

            <DynamicModulePreviewImage
              content={text}
              title={title}
              description={description}
              id={id}
              uuid={uuid}
              copyright={copyright}
              drawing={drawing}
            />
          </TypographyBlockUI.Definition>
        </TypographyBlockUI>
      </div>
    );
  }

  if (type === MediaBlockType.VIDEO && text && text !== "") {
    return (
      <div className="flex w-full flex-col">
        <TypographyBlockUI>
          <TypographyBlockUI.Definition type={type}>
            <TypographyUI>
              <ModulePreviewParagraph hasComment={false} text={instruction} />
            </TypographyUI>

            <DynamicModulePreviewVideo
              content={text}
              title={title}
              description={description}
              copyright={copyright}
              isReadonly
              markers={markers}
              id={id}
              uuid={uuid}
            />
          </TypographyBlockUI.Definition>
        </TypographyBlockUI>
      </div>
    );
  }

  if (text && text !== "") {
    return (
      <TypographyBlockUI>
        <TypographyBlockUI.Definition type={type} style={{ marginTop: 0 }}>
          <ModulePreviewParagraph text={text} />
        </TypographyBlockUI.Definition>
      </TypographyBlockUI>
    );
  }
  return <></>;
};
export const WrappedBlocks = ({ blocks }): JSX.Element => {
  const wrappedSections: JSX.Element[] = [];
  let currentSection: JSX.Element[] = [];

  blocks.forEach((block, index) => {
    const isTitleBlock = block.type === TextBlockType.TITLE;

    if (isTitleBlock && currentSection.length > 0) {
      wrappedSections.push(
        <div key={`section-${index}`} className={styles.section}>
          {currentSection}
        </div>
      );
      currentSection = [];
    }
    if (block.content.length > 0) {
      currentSection.push(
        <div key={block.uuid} id={block.uuid} className="mt-10">
          {getBlock(block)}
        </div>
      );
    }
  });

  if (currentSection.length > 0) {
    wrappedSections.push(
      <div key={`section-${blocks.length}`} className={styles.section}>
        {currentSection}
      </div>
    );
  }

  return <>{wrappedSections}</>;
};

const FeaturePreview = () => {
  // Hooks and States
  const { course, isLoading, error, fetchData, banner } = useCourseStore();
  const { getCurrentPage } = useCoursesParams();
  const page = getCurrentPage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const courseId = getCourseId(pathname);
  //const { device } = useDevicePreviewStore();
  const currentPage = getCurrentPage();
  const WIDTH = isOpen ? `${appendUnit(WIDTH_SIDEBAR)}` : "0";

  // Refs
  const isMonted = useRef<boolean>(false);

  // Methods
  const _callback = (state: boolean): void => {
    setIsOpen(state);
  };

  //Effects
  useEffect(() => {
    fetchData(page, courseId);
    isMonted.current = true;
  }, [page]);

  const _blocks = course?.pages?.[page - 1]?.blocks ?? [];

  if (isLoading) return <LoadingSpinnerUI />;
  if (error) return <>Error</>;
  if (course && isMonted.current)
    return (
      <div className={`no-scrollbar ${styles.previewContainer}`}>
        <DrawerUI
          position="fixed"
          width={WIDTH_SIDEBAR}
          placeIn="left"
          classnames="no-scrollbar bg-default-50 h-full overflow-y-auto top-0"
          hasOverlay={false}
          actionHandler={_callback}
          initialOpen={false}
          {...{ paddingBottom: 0, marginTop: 0 }}
        >
          <Summary blocks={reorganizePerIndex(_blocks)} />
        </DrawerUI>
        <div
          className="relative right-full"
          style={{ ...STYLE, width: WIDTH }}
        />
        <div
          id="scrolling_ref"
          className="page z-0 block w-full h-screen overflow-y-auto no-scrollbar"
        >
          <div
            style={{
              paddingTop: "20px",
              paddingBottom: "0px",
            }}
            className="p-6 h-auto"
          >
            <div className={styles.containerPage}>
              {currentPage === 1 && (
                <BannerUI isEdition={false} bannerT={banner} />
              )}
              <div className={styles.containerBlocks}>
                <WrappedBlocks blocks={reorganizePerIndex(_blocks)} />
              </div>
            </div>
          </div>
        </div>
        <BarUI
          bgColor="bg-default-50"
          fixedInPosition="bottom"
          position="fixed"
        >
          <PaginationGeneric isReadOnly />
        </BarUI>
      </div>
    );
};

export default FeaturePreview;
