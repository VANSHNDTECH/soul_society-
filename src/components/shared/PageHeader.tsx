import React from 'react';

export interface PageHeaderProps {
  badgeText: string;
  badgeVariant?: 'teal' | 'purple' | 'amber' | 'emerald' | 'stone';
  badgeIcon?: React.ReactNode;
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  badgeText,
  badgeVariant = 'teal',
  badgeIcon,
  title,
  subtitle,
  rightAction,
  gradientFrom = 'from-stone-900',
  gradientTo = 'to-stone-900',
}) => {
  return (
    <div
      className={`bg-gradient-to-r ${gradientFrom} via-slate-800 ${gradientTo} text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden text-left mb-8 border border-stone-800`}
    >
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wider uppercase border border-white/15">
            {badgeIcon}
            <span>{badgeText}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight font-heading text-white">
            {title}
          </h1>

          {subtitle && (
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {rightAction && <div className="shrink-0">{rightAction}</div>}
      </div>
    </div>
  );
};
