import MediaVideo from "ui/modules/mediaModule/video/mediaVideo";
import Tool from "../tool";

const ModulePreviewVideo = (props) => {
  const {
    content,
    title,
    description,
    copyright,
    id,
    uuid,
    markers,
    isReadonly,
  } = props;

  return (
    <>
      <Tool uuid={uuid} id={id} />

      <div className="flex justify-center relative mt-4">
        <MediaVideo
          content={content}
          title={title}
          description={description}
          copyright={copyright}
          isReadonly={isReadonly}
          markers={markers}
        />
      </div>
    </>
  );
};

export default ModulePreviewVideo;
