import { Meta } from "@/components/global/meta";
import {
  ClientLanguageRedirect,
  LanguageRedirectFallback,
} from "@/components/common/LanguageRedirect";
import tcyLangEn from "@private/lang/pages/en/packages/tate-chu-yoko.json";

const TARGET_PATH = "/packages/tate-chu-yoko";

export default function TateChuYokoRedirectPage() {
  const ogParams = new URLSearchParams({
    title: tcyLangEn.hero.heading,
    eyebrow: tcyLangEn.hero.eyebrow,
  });
  const ogImage = `/api/og?${ogParams.toString()}`;

  return (
    <>
      <Meta
        title={`${tcyLangEn.hero.heading} - ${tcyLangEn.hero.eyebrow} - Rox`}
        description={tcyLangEn.hero.tagline}
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
