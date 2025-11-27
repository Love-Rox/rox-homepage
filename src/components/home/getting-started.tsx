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

        <div className="space-y-2">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector Line/Arrow for previous step */}
              {index > 0 && (
                <div className="flex justify-center py-4" aria-hidden="true">
                  <svg
                    className="w-6 h-6 text-slate-300 dark:text-slate-600 animate-bounce"
                    style={{ animationDelay: `${index * 200}ms` }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7-7-7"
                    />
                  </svg>
                </div>
              )}

              <div
                className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700 relative z-10"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 bg-primary-500 dark:bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                    {step.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">
                      {step.title}
                    </h3>
                    <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-4 rounded-lg overflow-x-auto max-w-full border border-slate-700 dark:border-slate-800">
                      <code className="text-sm font-mono">{step.code}</code>
                    </pre>
                  </div>
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
