interface HeroProps {
  aboveLink: string;
  link: string;
  heading: string;
  description: string;
  getStarted: string;
  learnMore: string;
}

export const Hero = ({
  aboveLink,
  link,
  heading,
  description,
  getStarted,
  learnMore,
}: HeroProps) => {
  return (
    <div>
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 dark:text-gray-400 ring-1 ring-gray-900/10 dark:ring-gray-100/10 hover:ring-gray-900/20 dark:hover:ring-gray-100/20">
            {aboveLink}{" "}
            <a
              href="#"
              className="font-semibold text-primary-600 dark:text-primary-400"
            >
              <span aria-hidden="true" className="absolute inset-0" />
              {link} <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            {heading}
          </h1>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            {description}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-md bg-primary-600 dark:bg-primary-400 px-3.5 py-2.5 text-sm font-semibold text-white dark:text-slate-800 shadow-xs hover:bg-primary-500 dark:hover:bg-primary-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:focus-visible:outline-primary-400"
            >
              {getStarted}
            </a>
            <a href="#" className="text-sm/6 font-semibold">
              {learnMore} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
