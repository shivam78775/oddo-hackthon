import type { InputHTMLAttributes, ReactNode } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
  icon?: ReactNode;
}

export default function FormField({ label, error, multiline, rows = 3, className = '', id, icon, type, ...props }: FormFieldProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');

  // Support type="textarea" as an alias for multiline
  const isMultiline = multiline || type === 'textarea';
  const inputType = type === 'textarea' ? undefined : type;

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="input-label">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none">
            {icon}
          </div>
        )}
        {isMultiline ? (
          <textarea
            id={fieldId}
            rows={rows}
            className={`input-field resize-none ${icon ? 'pl-10' : ''} ${error ? 'input-error' : ''} ${className}`}
            {...(props as InputHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={fieldId}
            type={inputType}
            className={`input-field ${icon ? 'pl-10' : ''} ${error ? 'input-error' : ''} ${className}`}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
      </div>
      {error && <p className="input-error-text">{error}</p>}
    </div>
  );
}
