interface DocContentProps {
  title: string;
  content: string;
  lastUpdated?: string | undefined;
}

export const DocContent = ({
  title,
  content,
  lastUpdated,
}: DocContentProps) => {
  return (
    <article className="flex-1 min-w-0">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          {title}
        </h1>
        {lastUpdated && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: {lastUpdated}
          </p>
        )}
      </header>

      {/* TODO: Replace with proper markdown rendering */}
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            This is a placeholder page. Documentation content will be added
            here.
          </p>
        </div>
        <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
          {content}
        </p>
      </div>
    </article>
  );
};
