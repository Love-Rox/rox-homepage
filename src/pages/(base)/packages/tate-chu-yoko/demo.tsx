import { LanguageRedirect } from "@/components/common/LanguageRedirect";

export default function TateChuYokoDemoRedirectPage() {
  return (
    <LanguageRedirect
      targetPath="/packages/tate-chu-yoko/demo"
      title="tate-chu-yoko demo - Rox"
      description="Interactive playground for the tate-chu-yoko npm package"
      ogTitle="tate-chu-yoko demo"
    />
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
