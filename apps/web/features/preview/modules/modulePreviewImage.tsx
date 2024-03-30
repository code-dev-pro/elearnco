import MediaImage from "ui/modules/mediaModule/image/mediaImage";
import Tool from "../tool";

const ModulePreviewImage = (props) => {
  const { content, title, description, copyright, id, uuid } = props;

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
        />
      </div>
    </>
  );
};

export default ModulePreviewImage;
