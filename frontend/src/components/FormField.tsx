import type { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
}

export default function FormField({ label, error, multiline, rows = 3, className = '', id, ...props }: FormFieldProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="input-label">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={fieldId}
          rows={rows}
          className={`input-field resize-none ${error ? 'input-error' : ''} ${className}`}
          {...(props as InputHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={fieldId}
          className={`input-field ${error ? 'input-error' : ''} ${className}`}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <p className="input-error-text">{error}</p>}
    </div>
  );
}
