interface StackItem {
  name: string;
  src: string;
  href: string;
  description: string;
}

interface StacksProps {
  title: string;
  tech: StackItem[];
}

export const Stacks = ({ title, tech }: StacksProps) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-900/50 py-12 rounded-lg">
      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-8">
        {title}
      </h2>
      <div className="grid grid-cols-3 grid-rows-subgrid gap-8">
        {tech.map((stack) => (
          <div
            key={stack.name}
            className="grid grid-cols-1 items-center bg-slate-950/15 dark:bg-slate-200/15 p-6 rounded-lg shadow-sm"
          >
            <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 text-center">
              {stack.name}
            </h3>
            <img
              src={stack.src}
              alt={stack.name}
              className="h-16 w-16 object-contain mb-4 mx-auto"
            />
            <div>
              <p className="text-center text-slate-600 dark:text-slate-300">
                {stack.description}
              </p>
              <a
                href={stack.href}
                className="mt-4 block mx-auto w-fit bg-primary-600 dark:bg-primary-400 px-4 py-2 text-sm font-semibold text-white dark:text-slate-800 rounded-md hover:bg-primary-500 dark:hover:bg-primary-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:focus-visible:outline-primary-400"
              >
                Learn {stack.name} more &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
