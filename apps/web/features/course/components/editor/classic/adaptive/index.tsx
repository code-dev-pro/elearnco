import EditorGraph from "./graph";
import { GraphProvider } from "./graph/provider/editorGraphProvider";
const BACKGROUND_SYLES = {
  backgroundImage: "radial-gradient(#2f2f39 1px, transparent 0)",
  backgroundSize: "40px 40px",
  backgroundPosition: "-19px -19px",
};

const AdapativeEditor = () => {
  return (
    <div
      style={{ ...BACKGROUND_SYLES }}
      className="flex absolute h-full w-full z-0"
    >
      <GraphProvider>
        <EditorGraph />
      </GraphProvider>
    </div>
  );
};

export default AdapativeEditor;
