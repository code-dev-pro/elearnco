import FeatureCourses from "@/features/courses";
import { getMessages } from "@/lib/messages";
export async function generateMetadata({ params }) {
  const { locale } = params;
  const messages = (await getMessages(locale)) as {
    seo: {
      courses: {
        title: string;
        description: string;
      };
    };
  };

  return {
    title: messages.seo.courses.title,
    description: messages.seo.courses.description,
  };
}

export default async function Page({ searchParams }) {
  const query = searchParams?.query || "";

  return <FeatureCourses query={query} />;
}
