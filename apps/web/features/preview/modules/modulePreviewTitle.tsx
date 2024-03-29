import { clean } from "lib";
import { TextBlockType } from "schemas";
import TypographyUI from "ui/typography/TypographyUI";

const ModulePreviewTitle = (props) => {
  const { type, text } = props;

  return (
    <TypographyUI>
      <TypographyUI.Title
        level={type === TextBlockType.TITLE ? 2 : 3}
        style={{ marginBottom: "0.5rem", fontWeight: "bold", marginTop: 0 }}
      >
        <span
          dangerouslySetInnerHTML={{
            __html: clean(text?.replace(/<\/?h2[^>]*>|<\/?p[^>]*>/g, "")),
          }}
        />
      </TypographyUI.Title>
    </TypographyUI>
  );
};

export default ModulePreviewTitle;
