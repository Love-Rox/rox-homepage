interface Step {
  number: string;
  title: string;
  code: string;
}

interface GettingStartedProps {
  title: string;
  subtitle: string;
  steps: Step[];
  note: string;
}

export const GettingStarted = ({
  title,
  subtitle,
  steps,
  note,
}: GettingStartedProps) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-4 text-center">
          {title}
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 text-center">
          {subtitle}
        </p>

        <div className="space-y-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 bg-primary-500 dark:bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">
                    {step.title}
                  </h3>
                  <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm font-mono">{step.code}</code>
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-600 dark:text-slate-400 mt-8 italic">
          {note}
        </p>
      </div>
    </div>
  );
};
