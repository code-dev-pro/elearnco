import { Wheel } from "ui";
import TypographyBlockUI from "ui/typography/TypographyBlockUI";
import ModulePreviewParagraph from "./modulePreviewParagraph";
import Tool from "../tool";

const ModulePreviewWheel=(props) => {
    const { type, instruction, text,uuid,id } = props;

    return <TypographyBlockUI>
    <TypographyBlockUI.Definition type={type}>
      <ModulePreviewParagraph text={instruction} />
       <Tool uuid={uuid} id={id}/>
      <div className="p-4">
        <Wheel
          data={text.data}
          color={text.color}
          onChange={function (datas: any): void {
            throw new Error("Function not implemented.");
          }}
          isReadOnly
        />
      </div>
    </TypographyBlockUI.Definition>
  </TypographyBlockUI>
}


export default ModulePreviewWheel