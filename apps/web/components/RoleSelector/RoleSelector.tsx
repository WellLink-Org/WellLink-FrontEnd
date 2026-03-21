import styles from './RoleSelector.module.css';

const ROLES = [
  {
    value: 'user',
    label: 'Personal User',
    description: 'Track my health & get AI insights',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    value: 'doctor',
    label: 'Healthcare Provider',
    description: 'Receive patient reports & data',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
  },
];

export default function RoleSelector() {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>I am a</p>
      <div className={styles.grid}>
        {ROLES.map((role) => (
          <label key={role.value} className={styles.card}>
            <input
              type="radio"
              name="role"
              value={role.value}
              defaultChecked={role.value === 'user'}
              className={styles.radio}
            />
            <span className={styles.iconWrap}>{role.icon}</span>
            <span className={styles.roleLabel}>{role.label}</span>
            <span className={styles.roleDesc}>{role.description}</span>
            <span className={styles.check} aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
