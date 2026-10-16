import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  Ban,
  Check,
} from 'lucide-react';

export const ReportModal: React.FC = () => {
  const { reportTargetUser, setReportTargetUser, submitReport } = useApp();

  const [reason, setReason] = useState<string>('Inappropriate or boundary-crossing communication');
  const [details, setDetails] = useState<string>('');
  const [alsoBlock, setAlsoBlock] = useState<boolean>(true);

  if (!reportTargetUser) return null;

  const reasons = [
    'Inappropriate or boundary-crossing communication',
    'Spam, advertising, or commercial solicitation',
    'Unwanted pressure or persistent follow-ups',
    'Fake profile or impersonation',
    'Harassment or harmful behavior',
    'Other safety concern',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(reportTargetUser.id, reason, details.trim(), alsoBlock);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-rose-900 to-stone-900 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Report Profile: {reportTargetUser.name}</h2>
              <p className="text-xs text-rose-200">
                Help maintain a safe and comfortable community
              </p>
            </div>
          </div>

          <button
            onClick={() => setReportTargetUser(null)}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Target preview */}
          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <img
              src={reportTargetUser.avatar}
              alt={reportTargetUser.name}
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div>
              <h4 className="font-bold text-xs text-stone-900">{reportTargetUser.name}</h4>
              <p className="text-[11px] text-stone-500">{reportTargetUser.headline}</p>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              Select primary reason
            </label>
            <div className="space-y-1.5">
              {reasons.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    reason === r
                      ? 'border-rose-600 bg-rose-50/70 font-semibold text-rose-950'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <span>{r}</span>
                  {reason === r && <Check className="w-4 h-4 text-rose-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Additional details */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              Context or comments (optional)
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="Describe what occurred or what felt uncomfortable..."
              className="w-full p-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Block Checkbox */}
          <label className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
            <input
              type="checkbox"
              checked={alsoBlock}
              onChange={e => setAlsoBlock(e.target.checked)}
              className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
            />
            <span className="text-xs text-stone-800 font-medium">
              Also block {reportTargetUser.name} immediately so they cannot discover me
            </span>
          </label>

          {/* Prototype disclaimer */}
          <p className="text-[11px] text-stone-500 italic bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            Note: This demonstration prototype records your report locally in your Safety & Privacy Center to demonstrate moderation flows.
          </p>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setReportTargetUser(null)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-md transition-colors"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
