import { useIsCompletion } from "customhooks";
import dynamic from "next/dynamic";
import { useCourseStore } from "store/editor/course";
import { LAYOUT } from "ui";
import { BannerGeneric } from "ui/course/banner/BannerGenericUI";

const DynamicCompletion = dynamic(() => import("ui/layout/CompletionUI"));
const DynamicBlockNodes = dynamic(() => import("ui/nodes/BlockNodesListUI"));

const MAX_WIDTH = LAYOUT.MAX_WIDTH;

const AuthorMode = () => {
  const { currentPage } = useCourseStore();
  const isCompletetion = useIsCompletion("completion");
  return (
    <div
      id="scrolling_ref"
      className="page z-0 block w-full h-screen overflow-y-auto no-scrollbar ml-3"
    >
      <div
        style={{
          paddingTop: "100px",
          paddingBottom: "50px",
        }}
        className="page-content p-6 h-auto"
      >
        <div
          style={{
            maxWidth: MAX_WIDTH,
            margin: "0 auto",
            minHeight: "calc(100vh - 160px)",
            borderRadius: "24px 24px 0 0",
          }}
          className="bg-default"
        >
          {Number(currentPage) === 1 && !isCompletetion && <BannerGeneric />}
          {isCompletetion ? <DynamicCompletion /> : <DynamicBlockNodes />}
        </div>
      </div>
    </div>
  );
};

export default AuthorMode;
