import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onFilterClick?: () => void;
  onSortClick?: () => void;
  showControls?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  onFilterClick,
  onSortClick,
  showControls = true,
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="search-bar flex-1">
        <Search className="w-4 h-4 text-surface-500 shrink-0" />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-surface-100 placeholder:text-surface-500 focus:outline-none"
        />
      </div>

      {showControls && (
        <div className="flex items-center gap-2">
          {onFilterClick && (
            <button
              onClick={onFilterClick}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-surface-400 bg-surface-800/80 border border-surface-700/50 hover:text-white hover:border-surface-600 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter
            </button>
          )}
          {onSortClick && (
            <button
              onClick={onSortClick}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-surface-400 bg-surface-800/80 border border-surface-700/50 hover:text-white hover:border-surface-600 transition-all"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort
            </button>
          )}
        </div>
      )}
    </div>
  );
}
