import styles from './Footer.module.css';
import Logo from '../Logo/Logo';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.tagline}>Health data you own. Insights you trust.</p>
        </div>
        <nav className={styles.links} aria-label="Footer navigation">
          <Link href="#features">Features</Link>
          <Link href="#how-it-works">How It Works</Link>
          <Link href="#doctors">For Doctors</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </div>
      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} WellLink. All rights reserved.</span>
      </div>
    </footer>
  );
}
