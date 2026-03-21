import styles from './Logo.module.css';

export default function Logo() {
  return (
    <div className={styles.logo}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="13" stroke="#1f5c2e" strokeWidth="2" />
        <path d="M8 14 Q11 8 14 14 Q17 20 20 14" stroke="#1f5c2e" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <circle cx="14" cy="14" r="2.5" fill="#3d9e55" />
      </svg>
      <span className={styles.wordmark}>WellLink</span>
    </div>
  );
}
