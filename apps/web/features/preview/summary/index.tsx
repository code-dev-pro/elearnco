import { clean, reorganizePerIndex } from "lib";
import React from "react";
import { TextBlockType } from "schemas";
import TypographyUI from "ui/typography/TypographyUI";
import styles from "../style.module.scss";

const getBlock = (block) => {
  const type = block.type;
  const content = block.content?.[0]?.content;
  const text = content?.content;

  if (type === TextBlockType.TITLE || type === TextBlockType.SUBTITLE) {
    return (
      <TypographyUI>
        <TypographyUI.Title
          level={type === TextBlockType.TITLE ? 4 : 5}
          style={{ marginBottom: "0rem", fontWeight: "bold", marginTop: 0 }}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: clean(text?.replace(/<\/?h2[^>]*>|<\/?p[^>]*>/g, "")),
            }}
          />
        </TypographyUI.Title>
      </TypographyUI>
    );
  }
};
export const WrappedBlocks = ({ blocks }) => {
  let wrappedSections: JSX.Element[] = [];
  let currentSection: JSX.Element[] = [];

  const scrollToBlock = (element: string): void => {
    let item = document.getElementById(element);
    let wrapper = document.getElementById("scrolling_ref");

    if (item && wrapper) {
      let count = item.offsetTop - wrapper.scrollTop - 80;
      wrapper.scrollBy({ top: count, left: 0, behavior: "smooth" });
    }
  };

  const _actionHandler = (e: React.MouseEvent, uuid: string): void => {
    e.stopPropagation();
    e.preventDefault();
    // setActiveBlock(uuid);
    scrollToBlock(uuid);
  };

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
        <div
          key={block.uuid}
          onClick={(e) => _actionHandler(e, block.uuid)}
          className="mt-2 cursor-pointer"
        >
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

const Summary = ({ blocks }) => {
  return (
    <div className="summary p-2" style={{ marginTop: 80 }}>
      <h2>Summary og the page:</h2>
      <div className={styles.containerBlocks}>
        <WrappedBlocks blocks={reorganizePerIndex(blocks)} />
      </div>
    </div>
  );
};

export default Summary;
