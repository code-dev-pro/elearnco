import MediaImage from "ui/modules/mediaModule/image/mediaImage";
import Tool from "../tool";

const ModulePreviewImage = (props) => {
  const { content, title, description, copyright, id, uuid, drawing } = props;

  return (
    <>
      <Tool uuid={uuid} id={id} />
      <div className="flex justify-center relative mt-4">
        <MediaImage
          content={content}
          title={title}
          description={description}
          copyright={copyright}
          isReadonly
          drawing={drawing}
          blockNodeId={uuid}
        />
      </div>
    </>
  );
};

export default ModulePreviewImage;
