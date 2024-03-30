import React, { useMemo } from "react";
import { CSSProperties, ReactNode } from "react";
import { TextBlockType } from "schemas";

import { ICON_SIZE } from "../const";
import { IconUI } from "../icon/IconUI";

interface TypographyBlocProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

interface TitleProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  type: TextBlockType;
  isWithIcon?: boolean;
}

const STYLE_ICON = {
  position: "absolute",
  transform: "translate(calc(-50% - 1.5px), -50%)",
  borderRadius: "50%",
  padding: 6,
  top: "0px",
  left: "-1.5px",
} as CSSProperties;

const STYLES_BLOCK = {
  padding: "24px 32px",
  position: "relative",
  marginTop: 24,
  marginBottom: 32,
  borderRadius: 4,
} as CSSProperties;

function Paragraph(props: TitleProps) {
  const { children, type, style, isWithIcon = true } = props;

  const getColor = useMemo((): string => {
    if (type === TextBlockType.CONCLUSION) {
      return "#617bff";
    }
    if (type === TextBlockType.CITATION) {
      return "#d5ff61";
    }
    if (type === TextBlockType.WARNING) {
      return "#ff7161";
    }
    if (type === TextBlockType.MEMORISATION) {
      return "#d061ff";
    }
    if (type === TextBlockType.DEFINITION) {
      return "#61fff2";
    }
    if (type === TextBlockType.EXAMPLE) {
      return "#f2ff61";
    }
    return "#ff8000";
  }, []);

  const getIcon = useMemo(() => {
    return (
      <IconUI
        name={type?.replace(/\s/g, "").toLocaleLowerCase()}
        width={ICON_SIZE.width * 1.25}
        height={ICON_SIZE.height * 1.25}
      />
    );
  }, []);

  const STYLES = {
    ...STYLES_BLOCK,
    ...{ borderLeft: `3px solid ${getColor}` },
    ...style,
  } as CSSProperties;

  return (
    <div style={STYLES} className="bg-default-50">
      {isWithIcon && (
        <div
          className="bg-default-50"
          style={{
            ...STYLE_ICON,
            color: getColor,
            border: `2px solid ${getColor}`,
          }}
        >
          {getIcon}
        </div>
      )}
      {children}
    </div>
  );
}
function TypographyBlockUI(props: TypographyBlocProps) {
  const { children, className, style } = props;

  return (
    <div style={{ ...style }} className={`${className}`}>
      {children}
    </div>
  );
}

export default TypographyBlockUI;

TypographyBlockUI.Paragraph = Paragraph;
TypographyBlockUI.Citation = Paragraph;
TypographyBlockUI.Conclusion = Paragraph;
TypographyBlockUI.Definition = Paragraph;
TypographyBlockUI.Memorisation = Paragraph;
TypographyBlockUI.Citation = Paragraph;
TypographyBlockUI.Theoreme = Paragraph;
TypographyBlockUI.Example = Paragraph;
TypographyBlockUI.Maths = Paragraph;
TypographyBlockUI.Link = Paragraph;
TypographyBlockUI.Information = Paragraph;
TypographyBlockUI.Warning = Paragraph;
