import styles from './Features.module.css';

const FEATURES = [
  {
    icon: '📲',
    title: 'Sync from HealthKit',
    description: 'Automatically pull heart rate, sleep, activity, and 30+ metrics from your iPhone.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Insights',
    description: 'Our model analyses your trends and flags anomalies before they become problems.',
  },
  {
    icon: '🩺',
    title: 'Share with Your Doctor',
    description: 'Generate clean health reports and send them directly to your care team in one tap.',
  },
];

export default function Features() {
  return (
    <section id="features" className={styles.section}>
      <div className={styles.inner}>
        {FEATURES.map((f) => (
          <div key={f.title} className={styles.card}>
            <span className={styles.icon}>{f.icon}</span>
            <h3 className={styles.cardTitle}>{f.title}</h3>
            <p className={styles.cardDesc}>{f.description}</p>
            <span className={styles.arrow}>→</span>
          </div>
        ))}
      </div>
    </section>
  );
}
