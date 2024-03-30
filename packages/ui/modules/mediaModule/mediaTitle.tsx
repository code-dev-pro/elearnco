import React from "react";
import { GenericObject } from "schemas";

import EditableUI from "../../editable/EditableUI";

const MediaTitle = ({
  title,
  copyright,
  onChange,
  isReadonly,
}: {
  title: string;
  copyright: string;
  onChange: (data:GenericObject) => void;
  isReadonly?: boolean;
}) => {
  const _onChangeTitle = (m: string): void => onChange({ title: m });
  const _onChangeCopyright = (m: string): void => onChange({ copyright: m });

  return (
    <div className="relative left-0 bottom-10 flex p-2 justify-between w-full h-10 bg-black z-50">
      <EditableUI
        isReadonly={isReadonly}
        defaultText={title && title !=="" ? title : 'Write a title'}
        callback={_onChangeTitle}
      />
      <EditableUI
        defaultText={`© ${copyright && copyright !=="" ? copyright : 'Write a copyright'}`}
        callback={_onChangeCopyright}
        isReadonly={isReadonly}
      />
    </div>
  );
};

export default MediaTitle;
