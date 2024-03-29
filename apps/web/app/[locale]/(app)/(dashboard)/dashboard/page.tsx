import FeatureDashboard from "@/features/dashboard";
import { getMessages } from "@/lib/messages";

export async function generateMetadata({ params }) {
  const { locale } = params;
  const messages = (await getMessages(locale)) as {
    seo: {
      dashboard: {
        title: string;
        description: string;
      };
    };
  };

  return {
    title: messages.seo.dashboard.title,
    description: messages.seo.dashboard.description,
  };
}

export default async function Page() {
  return <FeatureDashboard />;
}
