import styles from "./AuthCard.module.css";
import Logo from "../Logo/Logo";
import Link from "next/link";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export default function AuthCard({
  children,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthCardProps) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoRow}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Logo />
          </Link>
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        {children}

        <p className={styles.footer}>
          {footerText}{" "}
          <Link href={footerLinkHref} className={styles.footerLink}>
            {footerLinkText}
          </Link>
        </p>
      </div>

      <p className={styles.legal}>
        By continuing you agree to our{" "}
        <Link href="/terms">Terms of Service</Link> and{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </div>
  );
}
