import { Meta } from "@/components/global/meta";
import {
  ClientLanguageRedirect,
  LanguageRedirectFallback,
} from "@/components/common/LanguageRedirect";
import langEn from "@private/lang/pages/en/packages/tate-chu-yoko/rehype.json";

const TARGET_PATH = "/packages/tate-chu-yoko/rehype";

export default function TateChuYokoRehypeRedirectPage() {
  const ogParams = new URLSearchParams({
    title: langEn.hero.heading,
    eyebrow: langEn.hero.eyebrow,
  });
  const ogImage = `/api/og?${ogParams.toString()}`;

  return (
    <>
      <Meta
        title={`${langEn.hero.heading} - ${langEn.hero.eyebrow} - Rox`}
        description={langEn.hero.tagline}
        image={ogImage}
        url={TARGET_PATH}
      />
      <ClientLanguageRedirect targetPath={TARGET_PATH} />
      <LanguageRedirectFallback targetPath={TARGET_PATH} />
    </>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
