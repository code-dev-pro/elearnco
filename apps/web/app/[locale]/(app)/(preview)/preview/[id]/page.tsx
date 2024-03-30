
import { getBaseUrl } from 'lib/requests/api.request';
import {ResolvingMetadata} from 'next';

import FeaturePreview from '@/features/preview';
import { getMessages } from "@/lib/messages";

export async function generateMetadata({ params },parent: ResolvingMetadata) {
  const { locale } = params;
  const messages = (await getMessages(locale)) as {
    seo: {
      default: {
        title: string;
        description: string;
      };
    };
  };
  const previousImages = (await parent).openGraph?.images ?? []
  return {
    title: messages.seo.default.title,
    description: messages.seo.default.description,
    openGraph: {
      images: ['/og-image.png', ...previousImages],
      url: getBaseUrl(),
    },
  };
}

export default function PreviewPage() {
  return <FeaturePreview/>;
}
