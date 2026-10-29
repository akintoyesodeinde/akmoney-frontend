import React from 'react';
import { CheckCircle2, Clock, AlertCircle, ShieldAlert } from 'lucide-react';

interface BadgeProps {
  status: string | number;
  label?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, label, size = 'sm' }) => {
  const normStatus = String(status).toUpperCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let icon = null;
  let text = label || normStatus;

  if (['1', 'COMPLETED', 'SUCCESS', 'SUCCESSFUL', 'ACTIVE'].includes(normStatus)) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    icon = <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />;
    text = label || 'Completed';
  } else if (['0', '2', 'PENDING', 'PROCESSING', 'INITIATE', 'ENQUEUED'].includes(normStatus)) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
    icon = <Clock className="w-3 h-3 text-amber-500 shrink-0 animate-pulse" />;
    text = label || 'Processing';
  } else if (['3', 'FAILED', 'REJECTED', 'REJECT'].includes(normStatus)) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
    icon = <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />;
    text = label || 'Failed';
  } else if (['AML_HOLD', 'HOLD', 'IN_REVIEW'].includes(normStatus)) {
    colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
    icon = <ShieldAlert className="w-3 h-3 text-purple-500 shrink-0" />;
    text = label || 'In Review';
  }

  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-0.5 gap-1.5' : 'text-sm px-3 py-1 gap-2';

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full ${sizeClasses} ${colorClasses}`}
    >
      {icon}
      <span>{text}</span>
    </span>
  );
};
