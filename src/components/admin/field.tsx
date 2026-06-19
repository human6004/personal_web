type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  help?: string;
};

export function Field({
  label,
  name,
  defaultValue = "",
  type = "text",
  required = false,
  multiline = false,
  rows = 4,
  help
}: FieldProps) {
  const inputClass = "brut-input text-sm";

  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold">{label}</span>
      {multiline ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={rows}
          required={required}
          className={inputClass}
        />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          required={required}
          className={inputClass}
        />
      )}
      {help ? <span className="text-xs leading-5 text-[var(--muted)]">{help}</span> : null}
    </label>
  );
}
