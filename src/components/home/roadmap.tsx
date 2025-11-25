interface RoadmapItem {
  phase: string;
  title: string;
  status: string;
  items: string[];
}

interface RoadmapProps {
  title: string;
  phases: RoadmapItem[];
}

const statusConfig = {
  complete: {
    badge: '✅ Complete',
    badgeClass: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    borderClass: 'border-green-500 dark:border-green-600'
  },
  'in-progress': {
    badge: '🚧 In Progress',
    badgeClass: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    borderClass: 'border-yellow-500 dark:border-yellow-600'
  },
  planned: {
    badge: '⏳ Planned',
    badgeClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    borderClass: 'border-blue-500 dark:border-blue-600'
  }
};

export const Roadmap = ({ title, phases }: RoadmapProps) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-12 text-center">{title}</h2>

      <div className="max-w-4xl mx-auto space-y-6">
        {phases.map((phase, index) => {
          const config = statusConfig[phase.status as keyof typeof statusConfig];
          return (
            <div
              key={index}
              className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-l-4 ${config.borderClass}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {phase.phase}: {phase.title}
                  </h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.badgeClass}`}>
                  {config.badge}
                </span>
              </div>

              <ul className="space-y-2">
                {phase.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex items-start gap-2 text-slate-600 dark:text-slate-300"
                  >
                    <span className="text-primary-500 dark:text-primary-400 mt-1">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
