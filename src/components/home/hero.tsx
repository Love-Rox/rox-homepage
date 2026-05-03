import { Button } from "@/components/common/button";
import { VersionBadge } from "./version-badge";

interface HeroProps {
  aboveLink: string;
  link: string;
  linkUrl: string;
  heading: string;
  description: string;
  getStarted: string;
  getStartedUrl: string;
  learnMore: string;
  learnMoreUrl: string;
  stableLabel?: string;
  prereleaseLabel?: string;
}

export const Hero = ({
  aboveLink,
  link,
  linkUrl,
  heading,
  description,
  getStarted,
  getStartedUrl,
  learnMore,
  learnMoreUrl,
  stableLabel = "Stable",
  prereleaseLabel = "Prerelease",
}: HeroProps) => {
  return (
    <div>
      <div className="mx-auto max-w-4xl px-6 py-32 sm:py-48 lg:px-8 lg:py-56">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 dark:text-gray-400 ring-1 ring-gray-900/10 dark:ring-gray-100/10 hover:ring-gray-900/20 dark:hover:ring-gray-100/20">
            {aboveLink}{" "}
            <a href={linkUrl} className="font-semibold text-primary-600 dark:text-primary-400">
              <span aria-hidden="true" className="absolute inset-0" />
              {link} <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-balance sm:text-7xl">{heading}</h1>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            {description}
          </p>
          <div className="mt-8">
            <VersionBadge stableLabel={stableLabel} prereleaseLabel={prereleaseLabel} />
          </div>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button href={getStartedUrl} variant="primary" size="md">
              {getStarted}
            </Button>
            <Button href={learnMoreUrl} variant="ghost" size="md">
              {learnMore} <span aria-hidden="true">→</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
