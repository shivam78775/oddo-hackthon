import { MapPin, type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon: Icon = MapPin, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-surface-800/60 border border-surface-700/50 flex items-center justify-center mb-5">
        <Icon className="w-10 h-10 text-surface-500" />
      </div>
      <h3 className="text-lg font-semibold text-surface-200 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-surface-400 max-w-md mb-6">{description}</p>
      )}
      {action && (
        <button onClick={action.onClick} className="btn-primary text-sm">
          {action.label}
        </button>
      )}
    </div>
  );
}
