import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeMode } from '../../context/ThemeContext';
import { Sun, Moon, Laptop, Check } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showDropdown?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showDropdown = false,
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuOpen]);

  const options: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5 text-amber-500" /> },
    { mode: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5 text-blue-400" /> },
    { mode: 'system', label: 'System', icon: <Laptop className="w-3.5 h-3.5 text-stone-400" /> },
  ];

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      {/* Primary Toggle Button */}
      <button
        type="button"
        onClick={() => {
          if (showDropdown) {
            setMenuOpen(prev => !prev);
          } else {
            toggleTheme();
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setMenuOpen(prev => !prev);
        }}
        aria-label={`Switch theme (currently ${resolvedTheme} mode, preference: ${theme})`}
        title={`Theme: ${theme.toUpperCase()} (${resolvedTheme === 'dark' ? 'Dark' : 'Light'}). Click to toggle, right-click for options.`}
        className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-white/80 dark:bg-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-700/80 border border-stone-200/90 dark:border-stone-700/80 shadow-2xs transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="w-4 h-4 text-teal-400 transition-transform duration-200 rotate-0" />
        ) : (
          <Sun className="w-4 h-4 text-amber-600 transition-transform duration-200 rotate-0" />
        )}
      </button>

      {/* Mode Selector Dropdown */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-stone-400 dark:text-stone-500 border-b border-stone-100 dark:border-stone-800">
            Theme Mode
          </div>
          {options.map((opt) => (
            <button
              key={opt.mode}
              type="button"
              onClick={() => {
                setTheme(opt.mode);
                setMenuOpen(false);
              }}
              className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors ${
                theme === opt.mode
                  ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-semibold'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {opt.icon}
                <span>{opt.label}</span>
              </div>
              {theme === opt.mode && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
