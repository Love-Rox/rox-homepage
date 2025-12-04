import { Meta } from "@/components/global/meta";
import { Hero } from "@/components/home/hero";
import { Stacks } from "@/components/home/stacks";
import { AdditionalStacks } from "@/components/home/additional-stacks";
import { Features } from "@/components/home/features";
import { GettingStarted } from "@/components/home/getting-started";
import { Roadmap } from "@/components/home/roadmap";
import { Community } from "@/components/home/community";

import hero_en from "@private/lang/components/home/en/hero.json";
import hero_ja from "@private/lang/components/home/ja/hero.json";

import stacksData_en from "@private/lang/components/home/en/stacks.json";
import stacksData_ja from "@private/lang/components/home/ja/stacks.json";

import additionalStacksData_en from "@private/lang/components/home/en/additional-stacks.json";
import additionalStacksData_ja from "@private/lang/components/home/ja/additional-stacks.json";

import featuresData_en from "@private/lang/components/home/en/features.json";
import featuresData_ja from "@private/lang/components/home/ja/features.json";

import gettingStartedData_en from "@private/lang/components/home/en/getting-started.json";
import gettingStartedData_ja from "@private/lang/components/home/ja/getting-started.json";

import roadmapData_en from "@private/lang/components/home/en/roadmap.json";
import roadmapData_ja from "@private/lang/components/home/ja/roadmap.json";

import communityData_en from "@private/lang/components/home/en/community.json";
import communityData_ja from "@private/lang/components/home/ja/community.json";

import { PageProps } from "waku/router";

const heroLangData = {
  en: hero_en,
  ja: hero_ja,
};

const stacksLangData = {
  en: stacksData_en,
  ja: stacksData_ja,
};

const additionalStacksLangData = {
  en: additionalStacksData_en,
  ja: additionalStacksData_ja,
};

const featuresLangData = {
  en: featuresData_en,
  ja: featuresData_ja,
};

const gettingStartedLangData = {
  en: gettingStartedData_en,
  ja: gettingStartedData_ja,
};

const roadmapLangData = {
  en: roadmapData_en,
  ja: roadmapData_ja,
};

const communityLangData = {
  en: communityData_en,
  ja: communityData_ja,
};

export default async function LangHomePage({ lang }: PageProps<"/[lang]">) {
  const supportedLocales = ["en", "ja"] as const;
  const locale = supportedLocales.includes(lang as any) ? (lang as typeof supportedLocales[number]) : "en";

  return (
    <div>
      <Meta
        title={heroLangData[locale].title}
        description={heroLangData[locale].description}
        image="/api/og?title=Rox"
      />
      <Hero {...heroLangData[locale]} />
      <Stacks {...stacksLangData[locale]} />
      <AdditionalStacks {...additionalStacksLangData[locale]} />
      <Features {...featuresLangData[locale]} />
      <GettingStarted {...gettingStartedLangData[locale]} />
      <Roadmap {...roadmapLangData[locale]} />
      <Community {...communityLangData[locale]} />
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
