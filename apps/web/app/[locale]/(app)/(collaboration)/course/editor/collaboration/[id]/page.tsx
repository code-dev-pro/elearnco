import FeatureCourseEditor from "@/features/course";
import { getMessages } from "@/lib/messages";

export async function generateMetadata({ params }) {
  const { locale } = params;
  const messages = (await getMessages(locale)) as {
    seo: {
      editor: {
        title: string;
        description: string;
      };
    };
  };

  return {
    title: messages.seo.editor.title,
    description: messages.seo.editor.description,
  };
}

export default function CourseEditorPage() {
  return <FeatureCourseEditor />;
}
