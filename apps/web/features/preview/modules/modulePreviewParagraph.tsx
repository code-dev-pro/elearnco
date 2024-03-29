import { clean } from "lib";
import TypographyUI from "ui/typography/TypographyUI";
import Tool from "../tool";

const ModulePreviewParagraph = (props) => {
  const { text, uuid, id, hasComment = true } = props;

  return (
    <>
      {hasComment && <Tool uuid={uuid} id={id} />}
      <TypographyUI>
        <TypographyUI.Text style={{ marginBottom: "1rem" }}>
          <span dangerouslySetInnerHTML={{ __html: clean(text) }} />
        </TypographyUI.Text>
      </TypographyUI>
    </>
  );
};

export default ModulePreviewParagraph;
