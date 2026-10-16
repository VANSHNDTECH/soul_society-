import React from 'react';
import { Search, Users, Sparkles } from 'lucide-react';

export type AppModuleId = 'module-1' | 'module-2' | 'module-3';

export interface ModuleNavConfig {
  id: AppModuleId;
  route: string;
  number: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  activeColor: string;
  activeBorder: string;
  activeBadge: string;
  dotColor: string;
}

export const MODULE_NAV_ITEMS: ModuleNavConfig[] = [
  {
    id: 'module-1',
    route: '/module-1',
    number: '01',
    title: 'Module 1 — The Problem Detective',
    subtitle: 'Research & Evidence',
    icon: <Search className="w-4 h-4" />,
    activeColor: 'bg-teal-900/10 text-teal-950',
    activeBorder: 'border-teal-600',
    activeBadge: 'bg-teal-800 text-white',
    dotColor: 'bg-teal-600',
  },
  {
    id: 'module-2',
    route: '/module-2',
    number: '02',
    title: 'Module 2 — The People Left Out',
    subtitle: 'Personas & User Needs',
    icon: <Users className="w-4 h-4" />,
    activeColor: 'bg-purple-900/10 text-purple-950',
    activeBorder: 'border-purple-600',
    activeBadge: 'bg-purple-800 text-white',
    dotColor: 'bg-purple-600',
  },
  {
    id: 'module-3',
    route: '/module-3',
    number: '03',
    title: 'Module 3 — The Solution Architect',
    subtitle: 'Prototype & Solution',
    icon: <Sparkles className="w-4 h-4" />,
    activeColor: 'bg-blue-900/10 text-blue-950',
    activeBorder: 'border-blue-600',
    activeBadge: 'bg-blue-800 text-white',
    dotColor: 'bg-blue-600',
  },
];

interface ModuleNavigationProps {
  activeModule: AppModuleId;
  onSelectModule: (moduleId: AppModuleId) => void;
  className?: string;
  compact?: boolean;
}

export const ModuleNavigation: React.FC<ModuleNavigationProps> = ({
  activeModule,
  onSelectModule,
  className = '',
  compact = false,
}) => {
  return (
    <nav
      aria-label="Global Module Navigation"
      className={`flex items-center gap-1 sm:gap-2 ${className}`}
    >
      {MODULE_NAV_ITEMS.map((item) => {
        const isActive = activeModule === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectModule(item.id)}
            aria-current={isActive ? 'page' : undefined}
            className={`group relative text-left rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-stone-400 ${
              compact
                ? 'px-2.5 py-1.5'
                : 'px-3 py-2 sm:px-3.5 sm:py-2'
            } ${
              isActive
                ? `bg-white dark:bg-stone-800/90 shadow-xs border ${item.activeBorder} ring-1 ${item.activeBorder}/30`
                : 'border border-transparent hover:bg-stone-200/50 dark:hover:bg-stone-800/50 hover:border-stone-300/60 dark:hover:border-stone-700 text-stone-600 dark:text-stone-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {/* Number Badge */}
              <div
                className={`w-6 h-6 rounded-lg text-[11px] font-mono font-bold flex items-center justify-center transition-colors shrink-0 ${
                  isActive
                    ? item.activeBadge
                    : 'bg-stone-200/80 dark:bg-stone-700 text-stone-600 dark:text-stone-300 group-hover:bg-stone-300 dark:group-hover:bg-stone-600'
                }`}
              >
                {item.number}
              </div>

              {/* Title and Subtitle */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs sm:text-xs font-bold tracking-tight truncate ${
                      isActive ? 'text-stone-900 dark:text-stone-100 font-heading' : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {item.title}
                  </span>
                  {isActive && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${item.dotColor} shrink-0 animate-pulse`}
                      title="Active Module"
                    />
                  )}
                </div>
                <div
                  className={`text-[10px] tracking-wide truncate ${
                    isActive ? 'text-stone-500 dark:text-stone-400 font-medium' : 'text-stone-400 dark:text-stone-500'
                  }`}
                >
                  {item.subtitle}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </nav>
  );
};
