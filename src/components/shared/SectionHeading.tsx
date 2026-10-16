import React from 'react';

export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: 'teal' | 'purple' | 'amber' | 'emerald' | 'stone';
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  badge,
  badgeVariant = 'stone',
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-stone-200/90 text-left ${className}`}
    >
      <div className="space-y-1">
        {badge && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
            {badge}
          </span>
        )}
        <h2 className="text-xl sm:text-2xl font-bold font-heading text-stone-900 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
