import type { Meta } from "@storybook/react";
import { TextBlockType } from "schemas";
import TypographyBlockUI from "ui/typography/TypographyBlockUI";
import TypographyUI from "ui/typography/TypographyUI";

const meta = {
  title: "Components/Modules/BlockText/Paragraph",
  component: TypographyBlockUI,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof TypographyBlockUI>;

export default meta;

export const Paragraph = {
  render: () => (
    <>
      <TypographyBlockUI style={{ maxWidth: 750, margin: "0 auto" }}>
        <TypographyBlockUI.Definition type={TextBlockType.DEFINITION}>
          <TypographyUI>
            <TypographyUI.Title
              level={4}
              style={{ marginBottom: "0.5rem", fontWeight: "bold" }}
            >
              {TextBlockType.DEFINITION}
            </TypographyUI.Title>
            <TypographyUI.Text style={{ marginBottom: "1rem" }}>
              Elearnco is just awesome. Perfect choice for your next education
              application.
            </TypographyUI.Text>
            <TypographyUI.Text style={{ marginBottom: "1rem" }}>
              Elearnco is just awesome. Perfect choice for your next education
              application.
            </TypographyUI.Text>
          </TypographyUI>
        </TypographyBlockUI.Definition>
      </TypographyBlockUI>
      <TypographyBlockUI style={{ maxWidth: 750, margin: "0 auto" }}>
        <TypographyBlockUI.Warning type={TextBlockType.WARNING}>
          <TypographyUI>
            <TypographyUI.Title
              level={4}
              style={{ marginBottom: "0.5rem", fontWeight: "bold" }}
            >
              {TextBlockType.WARNING}
            </TypographyUI.Title>
            <TypographyUI.Text style={{ marginBottom: "1rem" }}>
              Elearnco is just awesome. Perfect choice for your next education
              application.
            </TypographyUI.Text>
            <TypographyUI.Text style={{ marginBottom: "1rem" }}>
              Elearnco is just awesome. Perfect choice for your next education
              application.
            </TypographyUI.Text>
          </TypographyUI>
        </TypographyBlockUI.Warning>
      </TypographyBlockUI>
      <TypographyBlockUI style={{ maxWidth: 750, margin: "0 auto" }}>
        <TypographyBlockUI.Citation type={TextBlockType.CITATION}>
          <TypographyUI>
            <TypographyUI.Title
              level={4}
              style={{ marginBottom: "0.5rem", fontWeight: "bold" }}
            >
              {TextBlockType.CITATION}
            </TypographyUI.Title>
            <TypographyUI.Text style={{ marginBottom: "1rem" }}>
              Elearnco is just awesome. Perfect choice for your next education
              application.
            </TypographyUI.Text>
            <TypographyUI.Text style={{ marginBottom: "1rem" }}>
              Elearnco is just awesome. Perfect choice for your next education
              application.
            </TypographyUI.Text>
          </TypographyUI>
        </TypographyBlockUI.Citation>
      </TypographyBlockUI>
      <TypographyBlockUI style={{ maxWidth: 750, margin: "0 auto" }}>
        <TypographyBlockUI.Conclusion type={TextBlockType.CONCLUSION}>
          <TypographyUI>
            <TypographyUI.Title
              level={4}
              style={{ marginBottom: "0.5rem", fontWeight: "bold" }}
            >
              {TextBlockType.CONCLUSION}
            </TypographyUI.Title>
            <TypographyUI.Text style={{ marginBottom: "1rem" }}>
              Elearnco is just awesome. Perfect choice for your next education
              application.
            </TypographyUI.Text>
            <TypographyUI.Text style={{ marginBottom: "1rem" }}>
              Elearnco is just awesome. Perfect choice for your next education
              application.
            </TypographyUI.Text>
          </TypographyUI>
        </TypographyBlockUI.Conclusion>
      </TypographyBlockUI>
      <TypographyBlockUI style={{ maxWidth: 750, margin: "0 auto" }}>
        <TypographyBlockUI.Memorisation type={TextBlockType.MEMORISATION}>
          <TypographyUI>
            <TypographyUI.Title
              level={4}
              style={{ marginBottom: "0.5rem", fontWeight: "bold" }}
            >
              {TextBlockType.MEMORISATION}
            </TypographyUI.Title>
            <TypographyUI.Text style={{ marginBottom: "1rem" }}>
              Elearnco is just awesome. Perfect choice for your next education
              application.
            </TypographyUI.Text>
            <TypographyUI.Text style={{ marginBottom: "1rem" }}>
              Elearnco is just awesome. Perfect choice for your next education
              application.
            </TypographyUI.Text>
          </TypographyUI>
        </TypographyBlockUI.Memorisation>
      </TypographyBlockUI>
    </>
  ),
};