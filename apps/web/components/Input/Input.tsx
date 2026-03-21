import styles from './Input.module.css';

interface InputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}

export default function Input({
  id,
  label,
  type = 'text',
  placeholder,
  autoComplete,
  required,
}: InputProps) {
  return (
    <div className={styles.group}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={styles.input}
      />
    </div>
  );
}
