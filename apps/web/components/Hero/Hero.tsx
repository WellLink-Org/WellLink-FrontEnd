import styles from "./Hero.module.css";
import Link from "next/link";

export default function Hero() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Left column */}
        <div className={styles.left}>
          <div className={styles.badge}>
            ✦ Powered by Apple HealthKit &amp; AI
          </div>

          <h1 className={styles.heading}>
            Your health data,
            <br />
            finally connected
          </h1>

          <p className={styles.sub}>
            Sync vitals from your iPhone, get personalised AI insights, and
            share reports with your doctor - all from one private dashboard.
          </p>

          <div className={styles.ctas}>
            <Link href="/download" className={styles.primaryCta}>
              Download App
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link href="#how-it-works" className={styles.secondaryCta}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path d="M6.5 5.5L10.5 8l-4 2.5V5.5z" fill="currentColor" />
              </svg>
              See how it works
            </Link>
          </div>
        </div>

        {/* Right column — doctor photo background with floating cards */}
        <div className={styles.right}>
          {/* Replace src with your actual image path */}
          <img
            src="/images/doctor-hero.png"
            alt="Doctor reviewing patient report"
            className={styles.photoBg}
          />

          {/* Floating card A — Report sent */}
          <div className={styles.floatCardA}>
            <span
              className={`${styles.floatIconWrap} ${styles.floatIconWrapGreen}`}
            >
              {/* Stethoscope / report icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M9 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8l-6-6H9z"
                  stroke="#2d7a40"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13 2v6h6"
                  stroke="#2d7a40"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 13h8M8 17h5"
                  stroke="#2d7a40"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <div className={styles.floatTitle}>Report delivered</div>
              <div className={styles.floatSub}>
                Dr. Nguyen received your weekly summary
              </div>
              <div className={styles.floatStatus}>
                <span
                  className={`${styles.floatDot} ${styles.floatDotGreen}`}
                />
                <span
                  className={`${styles.floatStatusText} ${styles.floatStatusTextGreen}`}
                >
                  Sent · just now
                </span>
              </div>
            </div>
          </div>

          {/* Floating card B — AI insight */}
          <div className={styles.floatCardB}>
            <span
              className={`${styles.floatIconWrap} ${styles.floatIconWrapAmber}`}
            >
              {/* Sparkle / AI icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                  stroke="#b36e00"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <div>
              <div className={styles.floatTitle}>AI insight</div>
              <div className={styles.floatSub}>
                Sleep consistency improved 18% this week
              </div>
              <div className={styles.floatStatus}>
                <span
                  className={`${styles.floatDot} ${styles.floatDotAmber}`}
                />
                <span
                  className={`${styles.floatStatusText} ${styles.floatStatusTextAmber}`}
                >
                  New · tap to review
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
