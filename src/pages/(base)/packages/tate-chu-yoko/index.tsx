import { LanguageRedirect } from "@/components/common/LanguageRedirect";

export default function TateChuYokoRedirectPage() {
  return (
    <LanguageRedirect
      targetPath="/packages/tate-chu-yoko"
      title="tate-chu-yoko - Rox"
      description="Automatic tate-chu-yoko (縦中横) wrapping for Japanese vertical text on the web"
      ogTitle="tate-chu-yoko"
    />
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
