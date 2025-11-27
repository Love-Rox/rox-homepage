'use client';

import { useState } from 'react';

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
  // Initialize with all phases collapsed
  const [openPhases, setOpenPhases] = useState<Set<number>>(new Set());

  const togglePhase = (index: number) => {
    setOpenPhases((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-12 text-center">{title}</h2>

      <div className="max-w-4xl mx-auto space-y-6">
        {phases.map((phase, index) => {
          const config = statusConfig[phase.status as keyof typeof statusConfig];
          const isOpen = openPhases.has(index);

          return (
            <div
              key={index}
              className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg border-l-4 ${config.borderClass} overflow-hidden transition-all duration-300`}
            >
              <button
                onClick={() => togglePhase(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex-1 pr-4">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {phase.phase}: {phase.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${config.badgeClass}`}>
                      {config.badge}
                    </span>
                  </div>
                </div>
                <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                  <svg
                    className="w-6 h-6 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="px-6 pb-6 pt-0">
                  <ul className="space-y-2 border-t border-slate-100 dark:border-slate-700 pt-4">
                    {phase.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start gap-2 text-slate-600 dark:text-slate-300"
                      >
                        <span className="text-primary-500 dark:text-primary-400 mt-1 shrink-0">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
